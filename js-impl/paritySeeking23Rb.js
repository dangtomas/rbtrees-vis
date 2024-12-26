import { RED, BLACK, LEFT, RIGHT, createNode, colorFlip, copyTree } from "./utils.js";
import { ParitySeekingRBTree, leftRotate23, rightRotate23, paritySeekingDelete } from "./paritySeekingDelete.js";

export class RB23Tree extends ParitySeekingRBTree {}

export function rb23Insert(T, key, steps) {
	steps.push({
		T: copyTree(T),
		description: `Adding a red node with key ${key} according to rules of binary search trees.`,
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
	rb23InsertFixup(T, x, steps);
	steps.push({
		T,
		description: "Done.",
	});
}

function rb23InsertFixup(T, x, steps) {
	while (true) {
		if (x.p.left.color === RED && x.p.right.color === RED) {
			steps.push({
				T: copyTree(T),
				description: `Node ${x.p.key} has two red children. We proceed with case (c) to
				move the red color up the tree.`,
				xId: `n-${x.p.key}`,
			});
			colorFlip(T, x.p);
			x = x.p;
		} else if (x.p.color === RED) {
			if (x.p === x.p.p.left) {
				if (x === x.p.right) {
					steps.push({
						T: copyTree(T),
						description: `Node ${x.key} and its parent ${x.p.key} are both red.
						We proceed with case (a) to align the red nodes in one branch, which 
						serves as a preparation for case (b).`,
						xId: `n-${x.key}`,
						rotate: { dir: LEFT, key: x.p.key },
					});
					x = x.p;
					leftRotate23(T, x);
				}
				steps.push({
					T: copyTree(T),
					description: `Node ${x.key} and its parent ${x.p.key} are both red and aligned 
					in one branch. We turn the consecutive red nodes to siblings (case (b)).`,
					xId: `n-${x.key}`,
					rotate: { dir: RIGHT, key: x.p.p.key },
				});
				rightRotate23(T, x.p.p);
			} else {
				if (x === x.p.left) {
					steps.push({
						T: copyTree(T),
						description: `Node ${x.key} and its parent ${x.p.key} are both red.
						We proceed with case (a) to align the red nodes in one branch, which 
						serves as a preparation for case (b).`,
						xId: `n-${x.key}`,
						rotate: { dir: RIGHT, key: x.p.key },
					});
					x = x.p;
					rightRotate23(T, x);
				}
				steps.push({
					T: copyTree(T),
					description: `Node ${x.key} and its parent ${x.p.key} are both red and aligned 
					in one branch. We turn the consecutive red nodes to siblings (case (b)).`,
					xId: `n-${x.key}`,
					rotate: { dir: LEFT, key: x.p.p.key },
				});
				leftRotate23(T, x.p.p);
			}
		} else {
			break;
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

export function rb23Delete(T, key, steps) {
	paritySeekingDelete(T, key, steps);
}
