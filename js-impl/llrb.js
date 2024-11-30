import { RED, BLACK, RBTree, createNode, minimum, colorFlip } from "./utils.js";

export class LLRBTree extends RBTree {}

function llrbLeftRotate(T, x) {
	const y = x.right;
	x.right = y.left;
	y.left = x;
	y.color = x.color;
	x.color = RED;
	return y;
}

function llrbRightRotate(T, x) {
	const y = x.left;
	x.left = y.right;
	y.right = x;
	y.color = x.color;
	x.color = RED;
	return y;
}

function llrbFixup(T, h) {
	if (h.left.color !== RED && h.right.color === RED) {
		h = llrbLeftRotate(T, h);
	}
	if (h.left.color === RED && h.left.left.color === RED) {
		h = llrbRightRotate(T, h);
	}
	if (h.left.color === RED && h.right.color === RED) {
		colorFlip(T, h);
	}
	return h;
}

export function llrbInsert(T, key) {
	const x = createNode(T, key);
	T.root = llrbInsertRec(T, T.root, x);
	T.root.color = BLACK;
}

function llrbInsertRec(T, h, x) {
	if (h === T.NIL) {
		return x;
	}
	if (x.key < h.key) {
		h.left = llrbInsertRec(T, h.left, x);
	} else {
		h.right = llrbInsertRec(T, h.right, x);
	}

	return llrbFixup(T, h);
}

function moveRedLeft(T, h) {
	colorFlip(T, h);
	if (h.right.left.color === RED) {
		h.right = llrbRightRotate(T, h.right);
		h = llrbLeftRotate(T, h);
		colorFlip(T, h);
	}
	return h;
}

function moveRedRight(T, h) {
	colorFlip(T, h);
	if (h.left.left.color === RED) {
		h = llrbRightRotate(T, h);
		colorFlip(T, h);
	}
	return h;
}

function llrbDeleteMin(T, h) {
	if (h.left === T.NIL) {
		return T.NIL;
	}
	if (h.left.color !== RED && h.left.left.color !== RED) {
		h = moveRedLeft(T, h);
	}
	h.left = llrbDeleteMin(T, h.left);
	return llrbFixup(T, h);
}

export function llrbDelete(T, key) {
	T.root = llrbDeleteRec(T, T.root, key);
	T.root.color = BLACK;
}

function llrbDeleteRec(T, h, key) {
	if (key < h.key) {
		if (h.left.color !== RED && h.left.left.color !== RED) {
			h = moveRedLeft(T, h);
		}
		h.left = llrbDeleteRec(T, h.left, key);
	} else {
		if (h.left.color === RED) {
			h = llrbRightRotate(T, h);
		}
		if (key === h.key && h.right === T.NIL) {
			return T.NIL;
		}
		if (h.right.color !== RED && h.right.left.color !== RED) {
			h = moveRedRight(T, h);
		}
		if (key === h.key) {
			h.key = minimum(T, h.right).key;
			h.right = llrbDeleteMin(T, h.right);
		} else {
			h.right = llrbDeleteRec(T, h.right, key);
		}
	}
	return llrbFixup(T, h);
}
