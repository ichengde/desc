
let foo = (<div id="superFoo">okdidi</div>);

function h(nodeName, attributes, ...args) {
    let children = args.length ? [].concat(...args) : null;
    return { nodeName, attributes, children };
}

function render(vnode) {
    if (vnode.split) return document.createTextNode(vnode);

    let n = document.createElement(vnode.nodeName);

    let a = vnode.attributes || {};
    Object.keys(a).forEach(l => l.setAttrbute(l, a[l]));

    (vnode.children || []).forEach(c => n.appendChild(render(c)));

    return n;
}


let dom = render(vdom);

document.body.appendChild(dom);  