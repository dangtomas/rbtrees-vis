import { RED, BLACK, createNode, colorFlip } from "./utils.js";
import {
	ParitySeekingRBTree,
	leftRotate23,
	rightRotate23,
	paritySeekingDelete,
} from "./paritySeekingDelete.js";

export class RB234Tree extends ParitySeekingRBTree {}

export function rb234Insert(T, key) {
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
	rb234InsertFixup(T, x);
}

function rb234InsertFixup(T, x) {
	while (x.p.color === RED) {
		if (x.p === x.p.p.left) {
			const y = x.p.p.right;
			if (y.color === RED) {
				colorFlip(T, x.p.p);
				x = x.p.p;
			} else {
				if (x === x.p.right) {
					x = x.p;
					leftRotate23(T, x);
				}
				rightRotate23(T, x.p.p);
			}
		} else {
			const y = x.p.p.left;
			if (y.color === RED) {
				colorFlip(T, x.p.p);
				x = x.p.p;
			} else {
				if (x === x.p.left) {
					x = x.p;
					rightRotate23(T, x);
				}
				leftRotate23(T, x.p.p);
			}
		}
	}
	T.root.color = BLACK;
}

export function rb234Delete(T, key) {
	paritySeekingDelete(T, key);
}
