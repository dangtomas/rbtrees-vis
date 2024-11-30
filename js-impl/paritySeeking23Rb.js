import { RED, BLACK, RBTree, createNode, colorFlip } from "./utils.js";

export class RB23Tree extends RBTree {}

export function leftRotate23(T, x) {
	const y = x.right;
	x.right = y.left;
	if (y.left !== T.NIL) {
		y.left.p = x;
	}
	y.p = x.p;
	if (x.p === T.NIL) {
		T.root = y;
	} else if (x === x.p.left) {
		x.p.left = y;
	} else {
		x.p.right = y;
	}
	y.left = x;
	x.p = y;
	y.color = x.color;
	x.color = RED;
}

export function rightRotate23(T, x) {
	const y = x.left;
	x.left = y.right;
	if (y.right !== T.NIL) {
		y.right.p = x;
	}
	y.p = x.p;
	if (x.p === T.NIL) {
		T.root = y;
	} else if (x === x.p.left) {
		x.p.left = y;
	} else {
		x.p.right = y;
	}
	y.right = x;
	x.p = y;
	y.color = x.color;
	x.color = RED;
}

export function rb23Insert(T, key) {
	const x = createNode(T, key);
	let z = T.root;
	let y = T.NIL;
	while (z !== T.NIL) {
		y = z;
		if (x.key < z.key) {
			z = z.left;
		} else {
			z = z.right;
		}
	}
	x.p = y;
	if (y === T.NIL) {
		T.root = x;
	} else if (x.key < y.key) {
		y.left = x;
	} else {
		y.right = x;
	}
	rb23InsertFixup(T, x);
}

function rb23InsertFixup(T, x) {
	while (true) {
		if (x.p.left.color === RED && x.p.right.color === RED) {
			colorFlip(T, x.p);
			x = x.p;
		} else if (x.p.color === RED) {
			if (x.p === x.p.p.left) {
				if (x === x.p.right) {
					x = x.p;
					leftRotate23(T, x);
				}
				rightRotate23(T, x.p.p);
			} else {
				if (x.p === x.p.p.right) {
					if (x === x.p.left) {
						x = x.p;
						rightRotate23(T, x);
					}
					leftRotate23(T, x.p.p);
				}
			}
		} else {
			break;
		}
	}
	T.root.color = BLACK;
}
