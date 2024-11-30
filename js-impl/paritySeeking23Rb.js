import {
	RED,
	BLACK,
	RBTree,
	createNode,
	searchNode,
	colorFlip,
	minimum,
	rbTransplant,
} from "./utils.js";

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

export function paritySeekingDelete(T, key) {
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
		paritySeekingFixup(T, x);
	}
}

export function paritySeekingFixup(T, x) {
	while (x !== T.root && x.color === BLACK) {
		let y;
		if (x === x.p.left) {
			y = x.p.right;
		} else {
			y = x.p.left;
		}
		if (y.color === RED) {
			if (x === x.p.left) {
				leftRotate23(T, x.p);
			} else {
				rightRotate23(T, x.p);
			}
		} else {
			y.color = RED;
			x = x.p;
			x = case2Fixup(T, x, y);
		}
	}
	x.color = BLACK;
}

function case2Fixup(T, x, z) {
	if (z.left.color === RED || z.right.color === RED) {
		if (z === x.left) {
			if (z.left.color === BLACK) {
				leftRotate23(T, z);
			}
			rightRotate23(T, x);
		} else {
			if (z.right.color === BLACK) {
				rightRotate23(T, z);
			}
			leftRotate23(T, x);
		}
		x = x.p;
		x.left.color = BLACK;
		x.right.color = BLACK;
		x = T.root;
	}
	return x;
}