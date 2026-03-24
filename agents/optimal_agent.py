from backend.trader import Trader, SellAction, TakeAction, TradeAction
from backend.goods import GoodType
from backend.coins import BonusType

# Starting coin totals for opponent score estimation
INITIAL_COIN_TOTALS = {
    GoodType.DIAMOND: 29, GoodType.GOLD: 27, GoodType.SILVER: 25,
    GoodType.FABRIC: 17, GoodType.SPICE: 17, GoodType.LEATHER: 15,
}
INITIAL_BONUS_COUNTS = {BonusType.THREE: 7, BonusType.FOUR: 6, BonusType.FIVE: 5}
AVG_BONUS = {BonusType.THREE: 2.0, BonusType.FOUR: 5.0, BonusType.FIVE: 9.0}


class OptimalAgent(Trader):
    """
    Uses 1-step lookahead via simulate_action_fnc with a rich evaluation
    function that considers immediate gains, hand potential, opponent
    position, endgame control, and market dynamics.
    """

    def __init__(self, seed, name):
        super().__init__(seed, name)

    def select_action(self, actions, observation, simulate_action_fnc):
        best_action = None
        best_score = float('-inf')

        for action in actions:
            result = simulate_action_fnc(observation, action)
            score = self._evaluate(observation, result, action)
            if score > best_score:
                best_score = score
                best_action = action

        return best_action if best_action else self.rng.choice(actions)

    def _evaluate(self, before, after, action):
        # 1. Immediate points secured (coins + bonus tokens gained)
        immediate = self._secured_score(after) - self._secured_score(before)

        # 2. Change in future hand potential
        potential_delta = self._hand_potential(after) - self._hand_potential(before)

        # 3. Camel value (trade flexibility + camel bonus race)
        camels = after.actor_goods[GoodType.CAMEL]
        camel_val = min(camels, 8) * 0.7

        # 4. Hand space management
        space = after.max_player_goods_count - after.actor_non_camel_goods_count
        space_val = -4 if space == 0 else (-2 if space == 1 else 0)

        # 5. Endgame control (accelerate if winning, slow if losing)
        endgame_val = self._endgame_value(after)

        # 6. Penalize trading away premium goods to opponent
        trade_penalty = 0
        if isinstance(action, TradeAction):
            for gt in (GoodType.DIAMOND, GoodType.GOLD, GoodType.SILVER):
                if action.offered_goods[gt] > 0:
                    trade_penalty -= action.offered_goods[gt] * 2.5

        return (immediate
                + potential_delta * 0.7
                + camel_val
                + space_val
                + endgame_val
                + trade_penalty)

    # --- Component scores ---

    def _secured_score(self, obs):
        """Points already locked in from collected coins and bonus tokens."""
        total = 0
        for gt in GoodType:
            total += sum(obs.actor_goods_coins.get(gt, []))
        for bt in BonusType:
            total += obs.actor_bonus_coins_counts.get(bt, 0) * AVG_BONUS[bt]
        return total

    def _opponent_score(self, obs):
        """Estimate opponent's score from coins/bonuses no longer in market or ours."""
        total = 0
        for gt in GoodType:
            if gt == GoodType.CAMEL:
                continue
            remaining = sum(obs.market_goods_coins.get(gt, []))
            ours = sum(obs.actor_goods_coins.get(gt, []))
            total += max(0, INITIAL_COIN_TOTALS[gt] - remaining - ours)
        for bt in BonusType:
            remaining = obs.market_bonus_coins_counts.get(bt, 0)
            ours = obs.actor_bonus_coins_counts.get(bt, 0)
            opp = max(0, INITIAL_BONUS_COUNTS[bt] - remaining - ours)
            total += opp * AVG_BONUS[bt]
        return total

    def _hand_potential(self, obs):
        """Estimate future revenue from goods currently in hand."""
        total = 0
        for gt in GoodType:
            if gt == GoodType.CAMEL:
                continue
            count = obs.actor_goods[gt]
            if count == 0:
                continue

            available = obs.market_goods_coins.get(gt, [])
            sellable = min(count, len(available))

            if sellable == 0:
                # No coins left — only useful as trade fodder
                total += count * 0.3
                continue

            # Revenue from selling (coins pop highest-first = end of sorted list)
            coin_value = sum(available[-sellable:])

            # Bonus token estimate
            bonus = 0
            if sellable >= 5 and obs.market_bonus_coins_counts.get(BonusType.FIVE, 0) > 0:
                bonus = 9
            elif sellable >= 4 and obs.market_bonus_coins_counts.get(BonusType.FOUR, 0) > 0:
                bonus = 5
            elif sellable >= 3 and obs.market_bonus_coins_counts.get(BonusType.THREE, 0) > 0:
                bonus = 2

            # Confidence discount: larger holdings more likely to actually sell
            if count >= 5:
                discount = 0.85
            elif count >= 4:
                discount = 0.75
            elif count >= 3:
                discount = 0.60
            elif count >= 2:
                discount = 0.45
            else:
                discount = 0.30

            # Urgency bump: few coins left means sell soon or lose value
            if len(available) <= count:
                discount = min(discount + 0.10, 0.90)

            total += (coin_value + bonus) * discount

            # Set-building bonus: near a bonus threshold
            if count == 2:
                total += 2.5   # 1 away from 3-card bonus
            elif count == 4:
                total += 4.0   # 1 away from 5-card mega bonus
                # Even better if market has the good we need
                if obs.market_goods[gt] > 0:
                    total += 2.0

        return total

    def _endgame_value(self, obs):
        """Reward actions that push toward/away from game end based on position."""
        our_total = self._secured_score(obs) + self._hand_potential(obs) * 0.5
        opp_total = self._opponent_score(obs)

        empty_stacks = sum(
            1 for gt in GoodType
            if gt != GoodType.CAMEL and len(obs.market_goods_coins.get(gt, [])) == 0
        )

        if our_total > opp_total + 15:
            return empty_stacks * 2.5   # winning → accelerate game end
        elif our_total < opp_total - 10:
            return -empty_stacks * 1.5  # losing → slow down
        return 0

    def calculate_reward(self, old_observation, new_observation, has_acted, environment_reward):
        pass
