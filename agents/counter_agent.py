from backend.trader import Trader

class CounterAgent(Trader):
    """Agent that prints and increments a counter each turn to prove state persists."""

    def __init__(self, seed, name):
        super().__init__(seed, name)
        self.turn_counter = 0

    def select_action(self, actions, observation, simulate_action_fnc):
        self.turn_counter += 1
        print(f"[{self.name}] turn_counter = {self.turn_counter}")
        return self.rng.choice(actions)
