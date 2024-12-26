export const RED = true;
export const BLACK = false;

export const LEFT = 1;
export const RIGHT = 2;

export class RBNode {
	constructor(key) {
		this.key = key;
		this.color = BLACK;
		this.right = this;
		this.left = this;
		this.p = this;
	}
}

export class RBTree {
	constructor() {
		this.NIL = new RBNode(-1);
		this.root = this.NIL;
	}
}

export function createNode(T, key) {
	const newNode = new RBNode(key);
	newNode.left = T.NIL;
	newNode.right = T.NIL;
	newNode.p = T.NIL;
	newNode.color = RED;
	return newNode;
}

export function searchNode(T, key) {
	let x = T.root;
	while (x !== T.NIL) {
		if (key === x.key) {
			return x;
		} else if (key < x.key) {
			x = x.left;
		} else {
			x = x.right;
		}
	}
	return x;
}

export function minimum(T, x) {
	while (x.left !== T.NIL) {
		x = x.left;
	}
	return x;
}

export function colorFlip(T, x) {
	x.color = !x.color;
	x.left.color = !x.left.color;
	x.right.color = !x.right.color;
}

export function rbTransplant(T, u, v) {
	if (u.p === T.NIL) {
		T.root = v;
	} else if (u === u.p.left) {
		u.p.left = v;
	} else {
		u.p.right = v;
	}
	v.p = u.p;
}

export function copyTree(T) {
	const newT = new RBTree();
	newT.root = copyTreeRec(T, T.root, newT, newT.NIL);
	return newT;
}

function copyTreeRec(T, node, newT, p) {
	if (node === T.NIL) {
		return newT.NIL;
	}
	const newNode = new RBNode(node.key);
	newNode.p = p;
	newNode.color = node.color;
	newNode.left = copyTreeRec(T, node.left, newT, newNode);
	newNode.right = copyTreeRec(T, node.right, newT, newNode);

	return newNode;
}
