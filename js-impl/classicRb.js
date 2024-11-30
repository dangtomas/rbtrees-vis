import {
	RED,
	BLACK,
	RBTree,
	createNode,
	searchNode,
	minimum,
	rbTransplant,
} from "./utils.js";

export class ClassicRBTree extends RBTree {}

function leftRotate(T, x) {
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
}

function rightRotate(T, x) {
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
}

export function rbInsert(T, key) {
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
	rbInsertFixup(T, x);
}

function rbInsertFixup(T, x) {
	while (x.p.color === RED) {
		if (x.p === x.p.p.left) {
			const y = x.p.p.right;
			if (y.color === RED) {
				x.p.color = BLACK;
				y.color = BLACK;
				x.p.p.color = RED;
				x = x.p.p;
			} else {
				if (x === x.p.right) {
					x = x.p;
					leftRotate(T, x);
				}
				x.p.color = BLACK;
				x.p.p.color = RED;
				rightRotate(T, x.p.p);
			}
		} else {
			const y = x.p.p.left;
			if (y.color === RED) {
				x.p.color = BLACK;
				y.color = BLACK;
				x.p.p.color = RED;
				x = x.p.p;
			} else {
				if (x === x.p.left) {
					x = x.p;
					rightRotate(T, x);
				}
				x.p.color = BLACK;
				x.p.p.color = RED;
				leftRotate(T, x.p.p);
			}
		}
	}
	T.root.color = BLACK;
}

export function rbDelete(T, key) {
	const z = searchNode(T, key);
	let y = z;
	let yOriginalColor = y.color;
	let x;
	if (z.left === T.NIL) {
		x = z.right;
		rbTransplant(T, z, z.right);
	} else if (z.right === T.NIL) {
		x = z.left;
		rbTransplant(T, z, z.left);
	} else {
		y = minimum(T, z.right);
		yOriginalColor = y.color;
		x = y.right;
		if (y !== z.right) {
			rbTransplant(T, y, y.right);
			y.right = z.right;
			y.right.p = y;
		} else {
			x.p = y;
		}
		rbTransplant(T, z, y);
		y.left = z.left;
		y.left.p = y;
		y.color = z.color;
	}
	if (yOriginalColor === BLACK) {
		rbDeleteFixup(T, x);
	}
}

function rbDeleteFixup(T, x) {
	while (x !== T.root && x.color === BLACK) {
		if (x === x.p.left) {
			let w = x.p.right;
			if (w.color === RED) {
				w.color = BLACK;
				x.p.color = RED;
				leftRotate(T, x.p);
				w = x.p.right;
			}
			if (w.left.color === BLACK && w.right.color === BLACK) {
				w.color = RED;
				x = x.p;
			} else {
				if (w.right.color === BLACK) {
					w.left.color = BLACK;
					w.color = RED;
					rightRotate(T, w);
					w = x.p.right;
				}
				w.color = x.p.color;
				x.p.color = BLACK;
				w.right.color = BLACK;
				leftRotate(T, x.p);
				x = T.root;
			}
		} else {
			let w = x.p.left;
			if (w.color === RED) {
				w.color = BLACK;
				x.p.color = RED;
				rightRotate(T, x.p);
				w = x.p.left;
			}
			if (w.right.color === BLACK && w.left.color === BLACK) {
				w.color = RED;
				x = x.p;
			} else {
				if (w.left.color === BLACK) {
					w.right.color = BLACK;
					w.color = RED;
					leftRotate(T, w);
					w = x.p.left;
				}
				w.color = x.p.color;
				x.p.color = BLACK;
				w.left.color = BLACK;
				rightRotate(T, x.p);
				x = T.root;
			}
		}
	}
	x.color = BLACK;
}
