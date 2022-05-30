const allSame = (a, b, c) => {
    return a === b && a === c;
};
const allDifferent = (a, b, c) => {
    return a !== b && a !== c && b !== c;
};
const isCharacteristicSet = (a, b, c) => {
    return allDifferent(a, b, c) || allSame(a, b, c);
};
const isSet = (a, b, c) => {
    return isCharacteristicSet(a.q[0], b.q[0], c.q[0]) &&
        isCharacteristicSet(a.q[1], b.q[1], c.q[1]) &&
        isCharacteristicSet(a.q[2], b.q[2], c.q[2]) &&
        isCharacteristicSet(a.q[3], b.q[3], c.q[3]);
};
const findSet = (cards) => {
    for (let i = 0; i < cards.length - 2; i++) {
        for (let j = i + 1; j < cards.length - 1; j++) {
            for (let k = j + 1; k < cards.length; k++) {
                if (isSet(cards[i], cards[j], cards[k]))
                    return ({ a: cards[i], b: cards[j], c: cards[k] });
            }
        }
    }
};
const markSet = (cards) => {
    const set = findSet(cards);
    set.a.e.style.border = '5px solid pink';
    set.b.e.style.border = '5px solid pink';
    set.c.e.style.border = '5px solid pink';
};
window.addEventListener('keydown', (e) => {
    if (e.key === 'f') {
        let cards = Array.from(document.querySelectorAll('.secondcolumn img')).filter(x => x.id).map(x => ({ e: x, q: x.alt.split(',') }));
        markSet(cards);
    }
});