export function createDom(vnode) {
    if (vnode.split) return document.createTextNode(vnode);

    let n = document.createElement(vnode.nodeName);

    let a = vnode.attributes || {};
    Object.keys(a).forEach(l => n.setAttribute(l, a[l]));

    // (vnode.children || []).forEach(c => n.appendChild(render(c)));

    return n;
}

export function Desc(nodeName, attributes, ...args) {
    let children = args.length ? [].concat(...args) : null;
    return { nodeName, attributes, children };
}