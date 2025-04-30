import {
	RED, BLACK, LEFT, RIGHT, RBTree, copyTree, binarySearchTreeInsert, binarySearchTreeDelete
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

export function rbInsert(T, key, steps) {
	steps.push({
		T: copyTree(T),
		description: `Adding a red node with key ${key} according to rules of binary search trees.`,
	});
	const z = binarySearchTreeInsert(T, key)
	rbInsertFixup(T, z, steps);
	steps.push({
		T,
		description: "Done.",
	});
}

function rbInsertFixup(T, x, steps) {
	while (x.p.color === RED) {
		if (x.p === x.p.p.left) {
			const y = x.p.p.right;
			if (y.color === RED) {
				steps.push({
					T: copyTree(T),
					description: `Node ${x.key} and its parent ${x.p.key} are both red, uncle ${y.key} 
					is also red. We proceed with case 1.`,
					xId: `n-${x.key}`,
				});
				x.p.color = BLACK;
				y.color = BLACK;
				x.p.p.color = RED;
				x = x.p.p;
			} else {
				if (x === x.p.right) {
					steps.push({
						T: copyTree(T),
						description: `Node ${x.key} and its parent ${x.p.key} are both red, uncle 
						${y.key === -1 ? "NIL" : y.key} is black. We proceed with case 2 to align the 
						red nodes in one branch, which serves as a preparation for case 3.`,
						xId: `n-${x.key}`,
						rotate: { dir: LEFT, key: x.p.key },
					});
					x = x.p;
					leftRotate(T, x);
				}
				steps.push({
					T: copyTree(T),
					description: `Node ${x.key} and its parent ${x.p.key} are both red and aligned in one 
					branch, uncle ${y.key === -1 ? "NIL" : y.key} is black. We proceed with case 3.`,
					xId: `n-${x.key}`,
					rotate: { dir: RIGHT, key: x.p.p.key },
				});
				x.p.color = BLACK;
				x.p.p.color = RED;
				rightRotate(T, x.p.p);
			}
		} else {
			const y = x.p.p.left;
			if (y.color === RED) {
				steps.push({
					T: copyTree(T),
					description: `Node ${x.key} and its parent ${x.p.key} are both red, uncle ${y.key} is 
					also red. We proceed with case 1.`,
					xId: `n-${x.key}`,
				});
				x.p.color = BLACK;
				y.color = BLACK;
				x.p.p.color = RED;
				x = x.p.p;
			} else {
				if (x === x.p.left) {
					steps.push({
						T: copyTree(T),
						description: `Node ${x.key} and its parent ${x.p.key} are both red, uncle 
						${y.key === -1 ? "NIL" : y.key} is black. We proceed with case 2 to align 
						the red nodes in one branch, which serves as a preparation for case 3.`,
						xId: `n-${x.key}`,
						rotate: { dir: RIGHT, key: x.p.key },
					});
					x = x.p;
					rightRotate(T, x);
				}
				steps.push({
					T: copyTree(T),
					description: `Node ${x.key} and its parent ${x.p.key} are both red and aligned in 
					one branch, uncle ${y.key === -1 ? "NIL" : y.key} is black. We proceed with case 3.`,
					xId: `n-${x.key}`,
					rotate: { dir: LEFT, key: x.p.p.key },
				});
				x.p.color = BLACK;
				x.p.p.color = RED;
				leftRotate(T, x.p.p);
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

export function rbDelete(T, key, steps) {
	steps.push({
		T: copyTree(T),
		description: `Deleting node with key ${key} according to rules of binary search trees.`,
	});
	const { yOriginalColor, x } = binarySearchTreeDelete(T, key)
	if (yOriginalColor === BLACK) {
		rbDeleteFixup(T, x, steps);
	}
	steps.push({
		T,
		description: "Done.",
	});
}

function rbDeleteFixup(T, x, steps) {
	while (x !== T.root && x.color === BLACK) {
		if (x === x.p.left) {
			let w = x.p.right;
			if (w.color === RED) {
				steps.push({
					T: copyTree(T),
					description: `Node ${x === T.NIL ? "NIL" : x.key} has extra black color, 
					its sibling ${w.key} is red. We proceed with case 1.`,
					xId: x === T.NIL ? `${x === x.p.left ? "l" : "r"}-nil-${x.p.key}` : `n-${x.key}`,
					rotate: { dir: LEFT, key: x.p.key },
				});
				w.color = BLACK;
				x.p.color = RED;
				leftRotate(T, x.p);
				w = x.p.right;
			}
			if (w.left.color === BLACK && w.right.color === BLACK) {
				steps.push({
					T: copyTree(T),
					description: `Node ${x === T.NIL ? "NIL" : x.key} has extra black color, its sibling 
					${w.key} is black. Both children of the sibling are black. We proceed with case 2.`,
					xId: x === T.NIL ? `${x === x.p.left ? "l" : "r"}-nil-${x.p.key}` : `n-${x.key}`,
				});
				w.color = RED;
				x = x.p;
			} else {
				if (w.right.color === BLACK) {
					steps.push({
						T: copyTree(T),
						description: `Node ${x === T.NIL ? "NIL" : x.key} has extra black color and is a 
						left child. Its sibling ${w.key} is black with a red left child and black right child. 
						We proceed with case 3 as a preparation for case 4.`,
						xId: x === T.NIL ? `${x === x.p.left ? "l" : "r"}-nil-${x.p.key}` : `n-${x.key}`,	
						rotate: { dir: RIGHT, key: w.key },
					});
					w.left.color = BLACK;
					w.color = RED;
					rightRotate(T, w);
					w = x.p.right;
				}
				steps.push({
					T: copyTree(T),
					description: `Node ${x === T.NIL ? "NIL" : x.key} has extra black color and is a left child. 
					Its sibling ${w.key} is black with a red right child. We proceed with case 4.`,
					xId: x === T.NIL ? `${x === x.p.left ? "l" : "r"}-nil-${x.p.key}` : `n-${x.key}`,		
					rotate: { dir: LEFT, key: x.p.key },
				});
				w.color = x.p.color;
				x.p.color = BLACK;
				w.right.color = BLACK;
				leftRotate(T, x.p);
				x = T.root;
			}
		} else {
			let w = x.p.left;
			if (w.color === RED) {
				steps.push({
					T: copyTree(T),
					description: `Node ${x.key === T.NIL ? "NIL" : x.key} has extra black color, its 
					sibling ${w.key} is red. We proceed with case 1.`,
					xId: x === T.NIL ? `${x === x.p.left ? "l" : "r"}-nil-${x.p.key}` : `n-${x.key}`,	
					rotate: { dir: RIGHT, key: x.p.key },
				});
				w.color = BLACK;
				x.p.color = RED;
				rightRotate(T, x.p);
				w = x.p.left;
			}
			if (w.right.color === BLACK && w.left.color === BLACK) {
				steps.push({
					T: copyTree(T),
					description: `Node ${x === T.NIL ? "NIL" : x.key} has extra black color, its sibling 
					${w.key} is black. Both children of the sibling are black. We proceed with case 2.`,
					xId: x === T.NIL ? `${x === x.p.left ? "l" : "r"}-nil-${x.p.key}` : `n-${x.key}`,	
				});
				w.color = RED;
				x = x.p;
			} else {
				if (w.left.color === BLACK) {
					steps.push({
						T: copyTree(T),
						description: `Node ${x === T.NIL ? "NIL" : x.key} has extra black color and is a 
						right child. Its sibling ${w.key} is black with a red right child and black left 
						child. We proceed with case 3 as a preparation for case 4.`,
						xId: x === T.NIL ? `${x === x.p.left ? "l" : "r"}-nil-${x.p.key}` : `n-${x.key}`,
						rotate: { dir: LEFT, key: w.key },
					});
					w.right.color = BLACK;
					w.color = RED;
					leftRotate(T, w);
					w = x.p.left;
				}
				steps.push({
					T: copyTree(T),
					description: `Node ${x === T.NIL ? "NIL" : x.key} has extra black color and is a right 
					child. Its sibling ${w.key} is black with a red left child. We proceed with case 4.`,
					xId: x === T.NIL ? `${x === x.p.left ? "l" : "r"}-nil-${x.p.key}` : `n-${x.key}`,	
					rotate: { dir: RIGHT, key: x.p.key },
				});
				w.color = x.p.color;
				x.p.color = BLACK;
				w.left.color = BLACK;
				rightRotate(T, x.p);
				x = T.root;
			}
		}
	}
	if (x.color === RED) {
		steps.push({
			T: copyTree(T),
			description: `Node ${x.key} is red with extra black color. We proceed with the base case.`,
			xId: `n-${x.key}`,
		});
		x.color = BLACK;
	}
}
