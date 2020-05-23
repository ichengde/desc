
function createDom(fiber) {
    const dom =
        fiber.type == "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(fiber.type)

    // updateDom(dom, {}, fiber.props)

    return dom;
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    }
}

function Desc(type, attributes, ...children) {
    return {
        type,
        props: {
            ...attributes,
            children: children.map(child =>
                typeof child === "object"
                    ? child
                    : createTextElement(child)
            ),
        },
    }
}

let foo = (<div id="superFoo">
    <h1>bisd</h1>
    <h2>bisd</h2>
    <h3>bisd</h3>
</div>);


let nextUnitOfWork = null
let wipRoot = null

function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

        console.log('nextUnitOfWork', nextUnitOfWork)
        shouldYield = deadline.timeRemaining() < 1;
    }


    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }

    requestIdleCallback(workLoop);
}

function commitWork(fiber) {
    if (!fiber) return;

    const domParent = fiber.parent.dom;
    domParent.appendChild(fiber.dom);

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}


function performUnitOfWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }

    const elements = fiber.props.children;
    let index = 0;
    let prevSibling = null;

    while (index < elements.length) {
        const element = elements[index];

        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null
        };

        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }

        prevSibling = newFiber;
        index++;
    }

    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }


}

function commitRoot() {
    commitWork(wipRoot.child);

    wipRoot = null;
}

function render(element, container) {
    wipRoot = {
        dom: container,
        props: {

            children: [element]
        },
    }

    nextUnitOfWork = wipRoot
}
requestIdleCallback(workLoop);

render(foo, document.body);
