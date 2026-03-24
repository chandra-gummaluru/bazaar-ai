from flask import Flask, send_file, jsonify, request, send_from_directory
from flask_cors import CORS
import time
import sys
import importlib.util
from threading import Lock, Thread
from pathlib import Path

# Get the directory where this script is located
BASE_DIR = Path(__file__).parent.absolute()

# Add the parent folder to sys.path to enable importing backend as a package
sys.path.insert(0, str(BASE_DIR.parent))

# Now import from local backend package
from backend.bazaar import BasicBazaar
from backend.trader import Trader
from backend.goods import GoodType
from backend.coins import BonusType

app = Flask(__name__)
CORS(app)


def discover_agents():
    """Discover all agent classes in the agents folder"""
    agents_dir = BASE_DIR.parent.parent.parent / 'agents'
    agents = {}
    
    if not agents_dir.exists():
        print(f"Warning: Agents folder not found: {agents_dir}")
        return agents
    
    backend_parent = BASE_DIR.parent
    if str(backend_parent) not in sys.path:
        sys.path.insert(0, str(backend_parent))
    
    print(f"\nSearching for agents in: {agents_dir}")
    
    for agent_file in agents_dir.glob('*.py'):
        if agent_file.name.startswith('_'):
            continue
        
        try:
            module_name = agent_file.stem
            spec = importlib.util.spec_from_file_location(module_name, agent_file)
            module = importlib.util.module_from_spec(spec)
            sys.modules[module_name] = module
            spec.loader.exec_module(module)
            
            for item_name in dir(module):
                item = getattr(module, item_name)
                if (isinstance(item, type) and 
                    issubclass(item, Trader) and 
                    item is not Trader and
                    item.__module__ == module_name):
                    
                    agent_display_name = item_name.replace('Agent', '').replace('_', ' ').title()
                    agents[module_name] = {
                        'class': item,
                        'name': agent_display_name,
                        'module': module_name,
                        'file': agent_file.name
                    }
                    print(f"  Found agent: {agent_display_name} ({item_name})")
        
        except Exception as e:
            print(f"  Error loading {agent_file.name}: {e}")
    
    print(f"Loaded {len(agents)} agent(s)\n")
    return agents


AVAILABLE_AGENTS = discover_agents()


class GameState:
    def __init__(self):
        self.game = None
        self.player1 = None
        self.player2 = None
        self.game_started = False
        self.game_over = False
        self.lock = Lock()
        self.bot_thread = None
        self.bot_running = False
        self.bot_paused = False
        self.bot_step_requested = False
        self.bot_delay = 1.5
        self.bot_speed = 1.0
        self.bot_timeout = 30.0
        self.bot_timeout_player = None
        
    def create_game(self, agent1_id, agent2_id):
        with self.lock:
            if not agent1_id or agent1_id not in AVAILABLE_AGENTS:
                print(f"Invalid agent1_id: {agent1_id}")
                return False
            if not agent2_id or agent2_id not in AVAILABLE_AGENTS:
                print(f"Invalid agent2_id: {agent2_id}")
                return False
            
            agent1_info = AVAILABLE_AGENTS[agent1_id]
            agent2_info = AVAILABLE_AGENTS[agent2_id]
            
            self.player1 = agent1_info['class'](seed=356, name=f"{agent1_info['name']} 1")
            self.player2 = agent2_info['class'](seed=789, name=f"{agent2_info['name']} 2")
            
            print(f"Game created: {self.player1.name} vs {self.player2.name}")
            
            players = [self.player1, self.player2]
            seed = int(time.time() * 1000)
            self.game = BasicBazaar(seed=seed, players=players)
            self.game_started = True
            self.game_over = False
            
            self.bot_running = True
            self.bot_paused = True
            self.bot_thread = Thread(target=self.run_bot_game, daemon=True)
            self.bot_thread.start()
            
            return True
    
    def run_bot_game(self):
        """Run the game automatically with bot players"""
        while self.bot_running and not self.game_over:
            try:
                # Wait while paused (unless step requested)
                while self.bot_paused and not self.bot_step_requested:
                    if not self.bot_running:
                        break
                    time.sleep(0.1)
                
                if not self.bot_running:
                    break
                
                if self.bot_step_requested:
                    self.bot_step_requested = False
                
                with self.lock:
                    if not self.game or self.game.terminal(self.game.state):
                        self.game_over = True
                        break
                    
                    # state.actor is a deepcopy — find the original instance
                    # so that agent state persists across turns
                    state_actor = self.game.state.actor
                    current_player = next(
                        p for p in self.game.players if p.name == state_actor.name
                    )
                    actions = self.game.all_actions(state_actor, self.game.state)
                    
                    if not actions:
                        break
                    
                    observation = self.game.observe(current_player, self.game.state)
                    
                    def simulate_action(obs, act):
                        temp_state = self.game.state.clone()
                        temp_state = self.game.apply_action(temp_state, act.clone())
                        return self.game.observe(current_player, temp_state)
                    
                    action = None
                    if self.bot_timeout > 0:
                        start_time = time.time()
                        try:
                            action = current_player.select_action(actions, observation, simulate_action)
                            elapsed = time.time() - start_time
                            if elapsed > self.bot_timeout:
                                print(f"Bot {current_player.name} exceeded timeout: {elapsed:.2f}s > {self.bot_timeout}s")
                                self.bot_timeout_player = current_player.name
                                self.game_over = True
                                break
                        except Exception as e:
                            print(f"Bot {current_player.name} error: {e}")
                            self.bot_timeout_player = current_player.name
                            self.game_over = True
                            break
                    else:
                        action = current_player.select_action(actions, observation, simulate_action)
                    
                    if not action:
                        break
                    
                    self.game.old_state = self.game.state.clone()
                    self.game.state = self.game.apply_action(self.game.state.clone(), action.clone())
                    
                    for player in self.game.players:
                        has_acted = player == self.game.old_state.actor
                        old_observation = self.game.observe(player, self.game.old_state)
                        current_observation = self.game.observe(player, self.game.state)
                        environment_reward = self.game.calculate_reward(
                            player.clone(), self.game.old_state.clone(), self.game.state.clone()
                        )
                        player.calculate_reward(
                            old_observation.clone(), current_observation.clone(),
                            has_acted, environment_reward
                        )
                    
                    self.game.round += 1
                    print(f"Round {self.game.round}: {current_player.name} played {action.trader_action_type.value}")
                
                if not self.bot_paused:
                    actual_delay = self.bot_delay / self.bot_speed
                    time.sleep(actual_delay)
                
            except Exception as e:
                print(f"Error in bot game: {e}")
                import traceback
                traceback.print_exc()
                break
        
        self.bot_running = False
    
    def get_public_state(self):
        """Get state visible to the host UI"""
        if not self.game:
            return {
                'type': 'public',
                'gameStarted': False,
                'gameMode': None,
                'pendingMode': 'bot-vs-bot',
                'playersReady': True,
                'player1Connected': False,
                'player2Connected': False,
                'round': 0,
                'market': {},
                'marketCoins': {},
                'marketBonusTokens': {'THREE': 0, 'FOUR': 0, 'FIVE': 0},
                'deckSize': 0,
                'soldGoods': 0,
                'players': [
                    {'name': 'Player 1', 'score': 0, 'camelCount': 0, 'goods': {}, 'coins': {}, 'bonusCounts': {}},
                    {'name': 'Player 2', 'score': 0, 'camelCount': 0, 'goods': {}, 'coins': {}, 'bonusCounts': {}}
                ],
                'currentPlayer': None,
                'isTerminal': False,
                'lastAction': None,
                'waitingForPlayer': None,
                'botPaused': False,
                'botRunning': False,
                'botSpeed': self.bot_speed,
                'botTimeout': self.bot_timeout,
                'botTimeoutPlayer': None
            }
        
        state = self.game.state
        is_terminal = self.game.terminal(state) or self.bot_timeout_player is not None
        
        market_goods = {good_type.name: state.goods[good_type] 
                       for good_type in GoodType if state.goods[good_type] > 0}
        
        market_coins = {good_type.name: state.coins.goods_coins[good_type]
                       for good_type in GoodType if good_type != GoodType.CAMEL 
                       and state.coins.goods_coins[good_type]}
        
        market_bonus_tokens = {bonus_type.name: len(state.coins.bonus_coins[bonus_type])
                              for bonus_type in BonusType}
        
        players_data = []
        for player in self.game.players:
            player_goods = {good_type.name: state.player_goods[player][good_type]
                          for good_type in GoodType if state.player_goods[player][good_type] > 0}
            
            player_coins = {good_type.name: state.player_coins[player].goods_coins[good_type]
                          for good_type in GoodType 
                          if state.player_coins[player].goods_coins[good_type]}
            
            bonus_counts = {bonus_type.name: len(state.player_coins[player].bonus_coins[bonus_type])
                          for bonus_type in BonusType 
                          if len(state.player_coins[player].bonus_coins[bonus_type]) > 0}
            
            raw_score = sum(sum(coins) for coins in state.player_coins[player].goods_coins.values())
            score = raw_score
            camel_bonus = 0
            bonus_3x = 0
            bonus_4x = 0
            bonus_5x = 0
            
            if is_terminal:
                bonus_3x = sum(state.player_coins[player].bonus_coins[BonusType.THREE])
                bonus_4x = sum(state.player_coins[player].bonus_coins[BonusType.FOUR])
                bonus_5x = sum(state.player_coins[player].bonus_coins[BonusType.FIVE])
                score += bonus_3x + bonus_4x + bonus_5x
                
                other_player = state.get_non_actor() if player == state.actor else state.actor
                if state.player_goods[player][GoodType.CAMEL] > state.player_goods[other_player][GoodType.CAMEL]:
                    camel_bonus = state.camel_bonus
                    score += camel_bonus
            
            players_data.append({
                'name': player.name,
                'score': score,
                'rawScore': raw_score,
                'camelBonus': camel_bonus,
                'bonus3x': bonus_3x,
                'bonus4x': bonus_4x,
                'bonus5x': bonus_5x,
                'camelCount': state.player_goods[player][GoodType.CAMEL],
                'goods': player_goods,
                'coins': player_coins,
                'bonusCounts': bonus_counts
            })
        
        last_action = None
        if state.action:
            action = state.action
            last_action = {
                'player': self.game.old_state.actor.name if hasattr(self.game, 'old_state') else 'Unknown',
                'type': action.trader_action_type.value,
                'offered': {gt.name: action.offered_goods[gt] for gt in GoodType if action.offered_goods[gt] > 0},
                'requested': {gt.name: action.requested_goods[gt] for gt in GoodType if action.requested_goods[gt] > 0}
            }
        
        return {
            'type': 'public',
            'gameStarted': self.game_started,
            'gameMode': 'bot',
            'playersReady': True,
            'player1Connected': False,
            'player2Connected': False,
            'round': self.game.round,
            'market': market_goods,
            'marketCoins': market_coins,
            'marketBonusTokens': market_bonus_tokens,
            'deckSize': len(state.reserved_goods),
            'soldGoods': len(state.sold_goods),
            'players': players_data,
            'currentPlayer': state.actor.name if state.actor else None,
            'isTerminal': is_terminal,
            'lastAction': last_action,
            'waitingForPlayer': None,
            'botPaused': self.bot_paused,
            'botRunning': self.bot_running,
            'botSpeed': self.bot_speed,
            'botTimeout': self.bot_timeout,
            'botTimeoutPlayer': self.bot_timeout_player
        }


game_state = GameState()


# --- Routes ---

@app.route('/')
def index():
    host_path = BASE_DIR / 'host.html'
    if host_path.exists():
        return send_file(host_path)
    return "Error: host.html not found", 404


@app.route('/host.html')
def host():
    host_path = BASE_DIR / 'host.html'
    if host_path.exists():
        return send_file(host_path)
    return "Error: host.html not found", 404


@app.route('/shared.js')
def shared_js():
    shared_path = BASE_DIR / 'shared.js'
    if shared_path.exists():
        return send_file(shared_path, mimetype='application/javascript')
    return "Error: shared.js not found", 404


@app.route('/bgm/<path:filename>')
def bgm_file(filename):
    bgm_dir = BASE_DIR / 'bgm'
    if not bgm_dir.exists():
        return "Error: bgm folder not found", 404
    return send_from_directory(bgm_dir, filename)


@app.route('/api/agents')
def get_agents():
    agents_list = [
        {'id': agent_id, 'name': info['name'], 'module': info['module'], 'file': info['file']}
        for agent_id, info in AVAILABLE_AGENTS.items()
    ]
    return jsonify({'agents': agents_list})


@app.route('/api/state')
def get_state():
    return jsonify(game_state.get_public_state())


@app.route('/api/start', methods=['POST'])
def start_game():
    data = request.json
    agent1_id = data.get('agent1')
    agent2_id = data.get('agent2')
    
    if game_state.create_game(agent1_id=agent1_id, agent2_id=agent2_id):
        return jsonify({'success': True})
    return jsonify({'error': 'Cannot start game'}), 400


@app.route('/api/reset', methods=['POST'])
def reset_game():
    if game_state.bot_running:
        game_state.bot_running = False
        if game_state.bot_thread:
            game_state.bot_thread.join(timeout=2)
    
    game_state.game = None
    game_state.player1 = None
    game_state.player2 = None
    game_state.game_started = False
    game_state.game_over = False
    game_state.bot_paused = False
    game_state.bot_step_requested = False
    game_state.bot_timeout_player = None
    return jsonify({'success': True})


@app.route('/api/bot/pause', methods=['POST'])
def pause_bot():
    game_state.bot_paused = True
    return jsonify({'success': True, 'paused': True})


@app.route('/api/bot/resume', methods=['POST'])
def resume_bot():
    game_state.bot_paused = False
    return jsonify({'success': True, 'paused': False})


@app.route('/api/bot/step', methods=['POST'])
def step_bot():
    if not game_state.bot_paused:
        game_state.bot_paused = True
    game_state.bot_step_requested = True
    return jsonify({'success': True})


@app.route('/api/bot/speed', methods=['POST'])
def set_bot_speed():
    data = request.json
    speed = data.get('speed', 1.0)
    game_state.bot_speed = max(0.25, min(8.0, float(speed)))
    return jsonify({'success': True, 'speed': game_state.bot_speed})


@app.route('/api/bot/timeout', methods=['POST'])
def set_bot_timeout():
    data = request.json
    timeout = data.get('timeout', 30.0)
    game_state.bot_timeout = max(0, min(300.0, float(timeout)))
    return jsonify({'success': True, 'timeout': game_state.bot_timeout})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
