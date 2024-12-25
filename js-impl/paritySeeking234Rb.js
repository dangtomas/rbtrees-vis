import { RED, BLACK, createNode, colorFlip, copyTree } from "./utils.js";
import {
	ParitySeekingRBTree,
	leftRotate23,
	rightRotate23,
	paritySeekingDelete,
} from "./paritySeekingDelete.js";

export class RB234Tree extends ParitySeekingRBTree {}

export function rb234Insert(T, key, steps) {
	steps.push({
		T: copyTree(T),
		description: `Adding a red node with key ${key} according to rules of binary search trees.`,
		xId: null,
	});
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
	rb234InsertFixup(T, x, steps);
	steps.push({
		T,
		description: "Done.",
		xId: null,
	});
}

function rb234InsertFixup(T, x, steps) {
	while (x.p.color === RED) {
		if (x.p === x.p.p.left) {
			const y = x.p.p.right;
			if (y.color === RED) {
				steps.push({
					T: copyTree(T),
					description: `Node ${x.key} and his parent ${x.p.key} are both red, uncle 
					${y.key} is also red. We proceed with case 1.`,
					xId: `n-${x.key}`,
				});
				colorFlip(T, x.p.p);
				x = x.p.p;
			} else {
				if (x === x.p.right) {
					steps.push({
						T: copyTree(T),
						description: `Node ${x.key} and his parent ${
							x.p.key
						} are both red, uncle 
						${
							y === T.NIL ? "NIL" : y.key
						} is black. We proceed with case 2 to align the red nodes in one branch, which serves as a preparation for case 3.`,
						xId: `n-${x.key}`,
					});
					x = x.p;
					leftRotate23(T, x);
				}
				steps.push({
					T: copyTree(T),
					description: `Node ${x.key} and his parent ${
						x.p.key
					} are both red and aligned in one branch, uncle ${
						y === T.NIL ? "NIL" : y.key
					} is black. We proceed with case 3.`,
					xId: `n-${x.key}`,
				});
				rightRotate23(T, x.p.p);
			}
		} else {
			const y = x.p.p.left;
			if (y.color === RED) {
				steps.push({
					T: copyTree(T),
					description: `Node ${x.key} and his parent ${x.p.key} are both red, uncle 
					${y.key} is also red. We proceed with case 1.`,
					xId: `n-${x.key}`,
				});
				colorFlip(T, x.p.p);
				x = x.p.p;
			} else {
				if (x === x.p.left) {
					steps.push({
						T: copyTree(T),
						description: `Node ${x.key} and his parent ${
							x.p.key
						} are both red, uncle 
						${
							y === T.NIL ? "NIL" : y.key
						} is black. We proceed with case 2 to align the red nodes in one branch, which serves as a preparation for case 3.`,
						xId: `n-${x.key}`,
					});
					x = x.p;
					rightRotate23(T, x);
				}
				steps.push({
					T: copyTree(T),
					description: `Node ${x.key} and his parent ${
						x.p.key
					} are both red and aligned in one branch, uncle ${
						y === T.NIL ? "NIL" : y.key
					} is black. We proceed with case 3.`,
					xId: `n-${x.key}`,
				});
				leftRotate23(T, x.p.p);
			}
		}
	}
	if (T.root.color === RED) {
		steps.push({
			T: copyTree(T),
			description: `We color the root black to satisfy the properties of the tree.`,
			xId: `n-${x.key}`,
		});
		T.root.color = BLACK;
	}
}

export function rb234Delete(T, key, steps) {
	paritySeekingDelete(T, key, steps);
}
