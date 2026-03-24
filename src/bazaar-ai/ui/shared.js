// Shared constants and utilities for Bazaar

// Card styles for all good types
const cardStyles = {
    DIAMOND: { bg: 'bg-[#9E1B44]', border: 'border-[#F7D4A6]', borderColor: '#F7D4A6', iconColor: '#ffd5ea', coinColor: '#7f1d4e', text: 'Ruby' },
    GOLD:    { bg: 'bg-[#B8780A]', border: 'border-[#FFE2A9]', borderColor: '#FFE2A9', iconColor: '#ffe4b0', coinColor: '#b8780a', text: 'Gold' },
    SILVER:  { bg: 'bg-[#1A6E88]', border: 'border-[#BCE1E8]', borderColor: '#BCE1E8', iconColor: '#d6f6ff', coinColor: '#1a6e88', text: 'Silver' },
    FABRIC:  { bg: 'bg-[#6B28A8]', border: 'border-[#D8B7F4]', borderColor: '#D8B7F4', iconColor: '#ebccff', coinColor: '#6b28a8', text: 'Fabric' },
    SPICE:   { bg: 'bg-[#3A6E25]', border: 'border-[#B8DDA0]', borderColor: '#B8DDA0', iconColor: '#d2edbf', coinColor: '#3a6e25', text: 'Spice' },
    LEATHER: { bg: 'bg-[#C24A0A]', border: 'border-[#FFD4A3]', borderColor: '#FFD4A3', iconColor: '#ffd7b7', coinColor: '#c24a0a', text: 'Leather' },
    CAMEL:   { bg: 'bg-[#B07A37]', border: 'border-[#FFE0B4]', borderColor: '#FFE0B4', iconColor: '#ffe1bc', coinColor: '#b07a37', text: 'Camel' }
};

// Inline SVG resource icons. They inherit color via currentColor.
const resourceIconSVG = {
    DIAMOND: `
        <path d="M50 14 L79 41 L50 88 L21 41 Z" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>
        <path d="M21 41 L79 41 M50 14 L50 88 M34 23 L50 41 L66 23" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    `,
    GOLD: `
        <ellipse cx="50" cy="34" rx="22" ry="11" fill="currentColor" opacity="0.95"/>
        <ellipse cx="50" cy="50" rx="22" ry="11" fill="currentColor" opacity="0.82"/>
        <ellipse cx="50" cy="66" rx="22" ry="11" fill="currentColor" opacity="0.7"/>
        <ellipse cx="50" cy="34" rx="22" ry="11" fill="none" stroke="currentColor" stroke-width="4"/>
    `,
    SILVER: `
        <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" stroke-width="6"/>
        <circle cx="50" cy="50" r="17" fill="none" stroke="currentColor" stroke-width="4" opacity="0.9"/>
        <path d="M43 40 C45 36, 55 36, 57 40 C55 44, 45 44, 43 48 C45 52, 55 52, 57 56" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    `,
    FABRIC: `
        <path d="M20 65 C30 44, 44 42, 55 52 C64 60, 74 60, 82 50" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>
        <path d="M21 49 C31 28, 45 26, 56 36 C65 44, 75 44, 83 34" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" opacity="0.85"/>
    `,
    SPICE: `
        <path d="M35 68 C31 52, 41 36, 56 30 C66 26, 74 18, 78 10 C79 24, 74 35, 66 43 C55 53, 50 63, 48 78" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="39" cy="73" r="5" fill="currentColor"/>
    `,
    LEATHER: `
        <path d="M21 28 C30 18, 44 16, 57 20 C67 23, 78 22, 84 16 C84 28, 80 37, 83 47 C86 60, 80 75, 64 80 C50 84, 35 84, 25 75 C16 67, 15 53, 20 43 C24 35, 22 33, 21 28 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>
    `,
    CAMEL: `
        <path d="M18 63 L26 63 L26 76 M70 63 L78 63 L78 76 M30 63 C30 56, 34 48, 42 48 C46 48, 48 52, 52 52 C56 52, 58 45, 66 45 C74 45, 78 52, 78 60 L78 63 L30 63 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M66 45 C67 38, 72 33, 78 33 C81 33, 84 35, 86 39" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    `
};

function getResourceIconSvg(goodType, sizeClass = 'svg-lg') {
    const style = cardStyles[goodType] || cardStyles.LEATHER;
    const icon = resourceIconSVG[goodType] || resourceIconSVG.LEATHER;
    const iconColor = style.iconColor || style.borderColor || '#ffffff';
    return `
        <svg class="resource-svg ${sizeClass}" viewBox="0 0 100 100" aria-hidden="true" style="color: ${iconColor}">
            ${icon}
        </svg>
    `;
}

const uiBadgeIconSVG = {
    COINS: `
        <ellipse cx="50" cy="36" rx="24" ry="12" fill="currentColor" opacity="0.95"/>
        <ellipse cx="50" cy="50" rx="24" ry="12" fill="currentColor" opacity="0.78"/>
        <ellipse cx="50" cy="64" rx="24" ry="12" fill="currentColor" opacity="0.62"/>
        <ellipse cx="50" cy="36" rx="24" ry="12" fill="none" stroke="currentColor" stroke-width="5"/>
    `,
    MONEY_BAG: `
        <path d="M39 22 C45 28, 55 28, 61 22" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
        <path d="M34 34 C34 30, 38 27, 50 27 C62 27, 66 30, 66 34 C66 39, 61 42, 50 42 C39 42, 34 39, 34 34 Z" fill="currentColor" opacity="0.32"/>
        <path d="M24 52 C24 39, 34 42, 50 42 C66 42, 76 39, 76 52 C76 72, 64 82, 50 82 C36 82, 24 72, 24 52 Z" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>
        <path d="M50 52 L54 60 L63 61 L56 67 L58 76 L50 71 L42 76 L44 67 L37 61 L46 60 Z" fill="currentColor" opacity="0.86"/>
    `,
    CAMEL: `
        <path d="M16 62 L24 62 L24 76 M68 62 L76 62 L76 76 M28 62 C28 55, 33 48, 40 48 C44 48, 47 52, 50 52 C54 52, 57 44, 64 44 C72 44, 76 51, 76 59 L76 62 L28 62 Z" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M64 44 C66 37, 71 32, 77 32 C80 32, 83 34, 85 38" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
    `,
    BONUS3: `
        <circle cx="50" cy="50" r="34" fill="currentColor" opacity="0.22"/>
        <circle cx="50" cy="50" r="31" fill="none" stroke="currentColor" stroke-width="6"/>
        <path d="M50 28 L67 60 L33 60 Z" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>
        <circle cx="50" cy="68" r="4" fill="currentColor"/>
    `,
    BONUS4: `
        <circle cx="50" cy="50" r="34" fill="currentColor" opacity="0.22"/>
        <circle cx="50" cy="50" r="31" fill="none" stroke="currentColor" stroke-width="6"/>
        <rect x="34" y="34" width="32" height="32" rx="3" fill="none" stroke="currentColor" stroke-width="6"/>
        <path d="M34 34 L66 66 M66 34 L34 66" fill="none" stroke="currentColor" stroke-width="4" opacity="0.8"/>
    `,
    BONUS5: `
        <circle cx="50" cy="50" r="34" fill="currentColor" opacity="0.22"/>
        <circle cx="50" cy="50" r="31" fill="none" stroke="currentColor" stroke-width="6"/>
        <path d="M50 28 L67 41 L60 62 L40 62 L33 41 Z" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>
        <circle cx="50" cy="49" r="4" fill="currentColor"/>
    `
};

function getMoneyBagShellSvg(size = 90) {
    return `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" style="display:block; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5)); overflow: visible;">
            <!-- Clean bag silhouette -->
            <path d="M50 89 C70 89,85 75,85 58 C85 46,77 37,66 33 L64 24 C64 19,59 15,50 15 C41 15,36 19,36 24 L34 33 C23 37,15 46,15 58 C15 75,30 89,50 89 Z"
                  fill="url(#bagBodyGrad)" stroke="#8f4e2b" stroke-width="2.3" stroke-linejoin="round"/>

            <!-- Neck wrap -->
            <path d="M34 33 C34 28,39 25,50 25 C61 25,66 28,66 33 C66 38,60 42,50 42 C40 42,34 38,34 33 Z"
                  fill="url(#neckGrad)" stroke="#9b5b33" stroke-width="1.9"/>

            <!-- Minimal shadow for shape -->
            <path d="M73 60 C71 69,66 76,60 80" fill="none" stroke="rgba(46,20,12,0.22)" stroke-width="3.6" stroke-linecap="round"/>

            <!-- Simple tie loops -->
            <path d="M40 24 C35 18,29 14,31 10" fill="none" stroke="#d3a35a" stroke-width="2" stroke-linecap="round"/>
            <path d="M60 24 C65 18,71 14,69 10" fill="none" stroke="#d3a35a" stroke-width="2" stroke-linecap="round"/>
            <circle cx="50" cy="17" r="2.2" fill="#d3a35a" opacity="0.9"/>

            <defs>
                <linearGradient id="bagBodyGrad" x1="50" y1="16" x2="50" y2="90" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#7f3f24"/>
                    <stop offset="0.46" stop-color="#5f2d18"/>
                    <stop offset="1" stop-color="#43200f"/>
                </linearGradient>
                <linearGradient id="neckGrad" x1="50" y1="25" x2="50" y2="42" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#a86539"/>
                    <stop offset="1" stop-color="#6f3a20"/>
                </linearGradient>
            </defs>
        </svg>
    `;
}

function getUiBadgeIconSvg(iconType, sizeClass = 'ui-badge-md', color = '#d4a85f', extraClass = '') {
    const icon = uiBadgeIconSVG[iconType] || uiBadgeIconSVG.COINS;
    return `
        <svg class="ui-badge-svg ${sizeClass} ${extraClass}" viewBox="0 0 100 100" aria-hidden="true" style="color: ${color}">
            ${icon}
        </svg>
    `;
}

function createBonusTokenDataUri(iconType, color = '#f3dbb5') {
    const icon = uiBadgeIconSVG[iconType] || uiBadgeIconSVG.BONUS3;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="color:${color}">${icon}</svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// Bonus token images now reuse the exact same 3x/4x/5x icon family used in score chips.
const dots3SVG = createBonusTokenDataUri('BONUS3');
const dots4SVG = createBonusTokenDataUri('BONUS4');
const dots5SVG = createBonusTokenDataUri('BONUS5');
const dotsCamelSVG = createBonusTokenDataUri('CAMEL');

function getMarketStacksHtml({ marketCoins = {}, marketBonusTokens = {}, isTerminal = false, tokenImgClass = 'w-8 h-8' } = {}) {
    const marketCoinsDisplay = Object.keys(cardStyles)
        .filter(goodType => goodType !== 'CAMEL')
        .map(goodType => {
            const coins = marketCoins?.[goodType] || [];
            const style = cardStyles[goodType];
            const topCoin = coins.length ? coins[coins.length - 1] : '-';
            const coinBase = style.coinColor || '#7b3f2d';
            return `
            <div class="stack-item">
                <div id="market-stack-${goodType}" class="coin-stack" style="color: ${style.borderColor || '#f5d9ad'};">
                    <span class="coin-stack-layer l3" style="background: rgba(0,0,0,0.16);"></span>
                    <span class="coin-stack-layer l2" style="background: rgba(255,255,255,0.08);"></span>
                    <span class="coin-stack-layer l1" style="background: rgba(255,255,255,0.12);"></span>
                    <span class="coin-stack-top" style="background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.08)), ${coinBase};">${topCoin}</span>
                    <span class="coin-stack-count">${coins.length}</span>
                </div>
            </div>
            `;
        }).join('');

    const bonusTokensDisplay = `
        <div class="stack-item">
            <div id="bonus-stack-THREE" class="coin-stack" style="color: #f0d4a5;">
                <span class="coin-stack-layer l3" style="background: rgba(0,0,0,0.16);"></span>
                <span class="coin-stack-layer l2" style="background: rgba(255,255,255,0.08);"></span>
                <span class="coin-stack-layer l1" style="background: rgba(255,255,255,0.12);"></span>
                <span class="coin-stack-top overflow-hidden" style="background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.08)), #7b3f2d;">
                    <img src="${dots3SVG}" alt="3" class="${tokenImgClass}" />
                </span>
                <span class="coin-stack-count">${marketBonusTokens?.THREE ?? 0}</span>
            </div>
        </div>
        <div class="stack-item">
            <div id="bonus-stack-FOUR" class="coin-stack" style="color: #f0d4a5;">
                <span class="coin-stack-layer l3" style="background: rgba(0,0,0,0.16);"></span>
                <span class="coin-stack-layer l2" style="background: rgba(255,255,255,0.08);"></span>
                <span class="coin-stack-layer l1" style="background: rgba(255,255,255,0.12);"></span>
                <span class="coin-stack-top overflow-hidden" style="background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.08)), #7b3f2d;">
                    <img src="${dots4SVG}" alt="4" class="${tokenImgClass}" />
                </span>
                <span class="coin-stack-count">${marketBonusTokens?.FOUR ?? 0}</span>
            </div>
        </div>
        <div class="stack-item">
            <div id="bonus-stack-FIVE" class="coin-stack" style="color: #f0d4a5;">
                <span class="coin-stack-layer l3" style="background: rgba(0,0,0,0.16);"></span>
                <span class="coin-stack-layer l2" style="background: rgba(255,255,255,0.08);"></span>
                <span class="coin-stack-layer l1" style="background: rgba(255,255,255,0.12);"></span>
                <span class="coin-stack-top overflow-hidden" style="background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.08)), #7b3f2d;">
                    <img src="${dots5SVG}" alt="5" class="${tokenImgClass}" />
                </span>
                <span class="coin-stack-count">${marketBonusTokens?.FIVE ?? 0}</span>
            </div>
        </div>
        <div class="stack-item">
            <div id="bonus-stack-CAMEL" class="coin-stack" style="color: #f0d4a5;">
                <span class="coin-stack-layer l3" style="background: rgba(0,0,0,0.16);"></span>
                <span class="coin-stack-layer l2" style="background: rgba(255,255,255,0.08);"></span>
                <span class="coin-stack-layer l1" style="background: rgba(255,255,255,0.12);"></span>
                <span class="coin-stack-top overflow-hidden" style="background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.08)), #7b3f2d;">
                    <img src="${dotsCamelSVG}" alt="Camel" class="${tokenImgClass}" />
                </span>
                <span class="coin-stack-count">${isTerminal ? 0 : 1}</span>
            </div>
        </div>
    `;

    return `${marketCoinsDisplay}${bonusTokensDisplay}`;
}

function getMarketCardsRowHtml({
    displaySlots = [],
    hideCardsForClose = false,
    slotCount = 5,
    renderCardHtml = null
} = {}) {
    const wrapMarketSlot = (innerHtml) => `<div class="market-hanging-slot">${innerHtml || ''}</div>`;

    if (hideCardsForClose) {
        return Array(slotCount).fill(0).map(() => wrapMarketSlot('')).join('');
    }

    return displaySlots.slice(0, slotCount).map((goodType, slotIndex) => {
        if (!goodType) {
            return wrapMarketSlot('');
        }

        if (typeof renderCardHtml !== 'function') {
            return wrapMarketSlot('');
        }

        const cardHtml = renderCardHtml({ goodType, slotIndex });
        return wrapMarketSlot(cardHtml);
    }).join('');
}

function getMarketStageHtml({
    marketStatusText = '',
    marketCards = '',
    hideCardsForClose = false,
    gameStarted = false,
    soldGoods = 0,
    deckSize = 0,
    pileCardClass = 'goods-card'
} = {}) {
    return `
    <div class="game-panel mb-5 market-stage">
        <div class="market-sign market-sign-action" aria-hidden="true"><span id="floor-action-text">${marketStatusText}</span></div>
        <div id="market-zone" class="flex gap-4 justify-center flex-wrap">
            ${hideCardsForClose ? '' : `<div class="market-hanging-slot"><div class="deck-pile deck-pile-left">
                <span class="deck-pile-back back-2" aria-hidden="true"></span>
                <span class="deck-pile-back back-1" aria-hidden="true"></span>
                <span id="market-sold-pile" class="deck-pile-front ${pileCardClass} border-2 rounded-lg w-20 h-28 flex flex-col items-center justify-center gap-1 font-bold text-white shadow-lg" style="border-color: #7d3a2a; background: linear-gradient(180deg, #6f2d1f, #51221a); color: #ffeecf;">
                    <span class="w-full text-center text-3xl leading-none">${gameStarted ? soldGoods : '0'}</span>
                    <span class="resource-label w-full text-center text-xs">GOODS SOLD</span>
                </span>
            </div></div>`}
            ${marketCards}
            ${hideCardsForClose ? '' : `<div class="market-hanging-slot"><div class="deck-pile">
                <span class="deck-pile-back back-2" aria-hidden="true"></span>
                <span class="deck-pile-back back-1" aria-hidden="true"></span>
                <span id="market-deck-pile" class="deck-pile-front ${pileCardClass} border-2 rounded-lg w-20 h-28 flex flex-col items-center justify-center gap-1 font-bold text-white shadow-lg" style="border-color: #7d3a2a; background: linear-gradient(180deg, #6f2d1f, #51221a); color: #ffeecf;">
                    <span class="w-full text-center text-3xl leading-none">${gameStarted ? deckSize : '0'}</span>
                    <span class="resource-label w-full text-center text-xs">GOODS LEFT</span>
                </span>
            </div></div>`}
        </div>
    </div>
    `;
}

function getPlayerStripHtml({
    idx,
    playerName,
    score,
    bonusCounts = {},
    side = 'left',
    isActive = false,
    isTerminal = false,
    isCelebratingWinner = false,
    shouldLightTorch = false,
    nameplateStateClass = '',
    handRailHtml = '',
    handRailId = '',
    statPrefix = 'hstat'
} = {}) {
    const isLeft = side === 'left';
    const handRailIdAttr = handRailId ? ` id="${handRailId}"` : '';

    return `
        <div class="player-strip ${isActive && !isTerminal ? 'player-strip-active' : ''} ${isCelebratingWinner ? 'winner-celebrate' : ''}">
            <div class="player-header-rail ${isLeft ? 'player-header-left' : 'player-header-right'}">
                ${isLeft ? `<span class="turn-torch pillar-torch pillar-torch-left ${shouldLightTorch ? 'is-lit' : ''}" aria-hidden="true"></span>` : ''}
                <div class="player-nameplate sign-${isLeft ? 'left' : 'right'} ${nameplateStateClass}">
                    <span class="player-name">${playerName}</span>
                </div>
                ${!isLeft ? `<span class="turn-torch pillar-torch pillar-torch-right ${shouldLightTorch ? 'is-lit' : ''}" aria-hidden="true"></span>` : ''}
            </div>
            <div class="player-hero-stage ${isLeft ? 'player-hero-left' : 'player-hero-right'}">
                <div class="player-bag-column">
                    <div id="score-chip-${idx}" class="player-bag-wrap ${isLeft ? 'player-bag-left' : 'player-bag-right'}">
                        ${getMoneyBagShellSvg(272)}
                        <div class="player-bag-score">
                            <span id="${statPrefix}-${idx}-score" class="roll-value font-bold" style="font-family: Georgia, serif; font-size: 2.2rem; color: #fef3c7; line-height: 1; text-shadow: 0 2px 5px rgba(0,0,0,0.45);">${score}</span>
                        </div>
                        <div class="player-bag-bonuses ${isLeft ? 'bonuses-right' : 'bonuses-left'}">
                            <span class="bag-bonus-pill">${getUiBadgeIconSvg('BONUS3','ui-badge-md','#d4a85f')} <span id="${statPrefix}-${idx}-three" class="roll-value">${bonusCounts?.THREE ?? 0}</span></span>
                            <span class="bag-bonus-pill">${getUiBadgeIconSvg('BONUS4','ui-badge-md','#d4a85f')} <span id="${statPrefix}-${idx}-four" class="roll-value">${bonusCounts?.FOUR ?? 0}</span></span>
                            <span class="bag-bonus-pill">${getUiBadgeIconSvg('BONUS5','ui-badge-md','#d4a85f')} <span id="${statPrefix}-${idx}-five" class="roll-value">${bonusCounts?.FIVE ?? 0}</span></span>
                        </div>
                    </div>
                </div>
                <div${handRailIdAttr} class="player-hand-rail">${handRailHtml}</div>
            </div>
        </div>
    `;
}

function getTopLanternRowHtml(extraClass = '') {
    const cls = extraClass ? ` ${extraClass}` : '';
    return `
<div class="bazaar-lantern-row${cls}" aria-hidden="true">
    <span class="hanging-lantern lantern-left"></span>
    <span class="hanging-lantern lantern-right"></span>
</div>`;
}

function getBazaarInteriorDecorHtml({ includeCornerFiligree = true } = {}) {
    return `
    <div class="bazaar-light-strand" aria-hidden="true">
        <span class="strand-bulb"></span>
        <span class="strand-bulb"></span>
        <span class="strand-bulb"></span>
        <span class="strand-bulb"></span>
        <span class="strand-bulb"></span>
        <span class="strand-bulb"></span>
        <span class="strand-bulb"></span>
        <span class="strand-bulb"></span>
        <span class="strand-bulb"></span>
        <span class="strand-bulb"></span>
        <span class="strand-bulb"></span>
        <span class="strand-bulb"></span>
    </div>
    <div class="bazaar-pillars" aria-hidden="true">
        <span class="bazaar-pillar pillar-left"></span>
        <span class="bazaar-pillar pillar-right"></span>
        <span class="pillar-chain chain-left"><span class="pillar-medallion"></span></span>
        <span class="pillar-chain chain-right"><span class="pillar-medallion"></span></span>
    </div>
    ${includeCornerFiligree ? `
    <span class="corner-filigree filigree-tl" aria-hidden="true"></span>
    <span class="corner-filigree filigree-tr" aria-hidden="true"></span>
    <span class="corner-filigree filigree-bl" aria-hidden="true"></span>
    <span class="corner-filigree filigree-br" aria-hidden="true"></span>
    ` : ''}`;
}

/**
 * Get action description from action object
 * @param {object} action - Action object with type, offered, and requested
 * @returns {string} Human-readable action description
 */
function getActionDescription(action) {
    if (!action) return '';
    
    if (action.type === 'Take') {
        const goods = Object.entries(action.requested)
            .map(([type, count]) => `${count}x ${cardStyles[type]?.text || type}`)
            .join(', ');
        return `took ${goods}`;
    } else if (action.type === 'Sell') {
        const goods = Object.entries(action.offered)
            .map(([type, count]) => `${count}x ${cardStyles[type]?.text || type}`)
            .join(', ');
        return `sold ${goods}`;
    } else if (action.type === 'Trade') {
        const offered = Object.entries(action.offered)
            .map(([type, count]) => `${count}x ${cardStyles[type]?.text || type}`)
            .join(', ');
        const requested = Object.entries(action.requested)
            .map(([type, count]) => `${count}x ${cardStyles[type]?.text || type}`)
            .join(', ');
        return `traded ${offered} for ${requested}`;
    }
    return '';
}
