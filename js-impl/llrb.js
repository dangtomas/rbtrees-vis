import { RED, BLACK, LEFT, RIGHT, RBTree, createNode, minimum, colorFlip, copyTree } from "./utils.js";
import { leftRotate23, rightRotate23 } from "./paritySeekingDelete.js";

export class LLRBTree extends RBTree {}

function llrbLeftRotate(T, x) {
	return leftRotate23(T, x); // kvuli vizualizaci je nutne mit nastavene rodicovske uzly
}

function llrbRightRotate(T, x) {
	return rightRotate23(T, x); // kvuli vizualizaci je nutne mit nastavene rodicovske uzly
}

function llrbFixup(T, x, steps) {
	if (x.left.color !== RED && x.right.color === RED) {
		steps.push({
			T: copyTree(T),
			description: `Bottom-up pass: Node with key ${x.key} has a single red child as a right 
			child. We perform a left rotation to move the red child to the left.`,
			xId: `n-${x.key}`,
			rotate: { dir: LEFT, key: x.key },
		});
		x = llrbLeftRotate(T, x);
	}

	if (x.left.color === RED && x.left.left.color === RED) {
		steps.push({
			T: copyTree(T),
			description: `Bottom-up pass: Node with key ${x.key} has a single left red child, which
			also has a single red left child. We perform a right rotation to turn the consecutive 
			red nodes into siblings.`,
			xId: `n-${x.key}`,
			rotate: { dir: RIGHT, key: x.key },
		});
		x = llrbRightRotate(T, x);
	}

	if (x.left.color === RED && x.right.color === RED) {
		steps.push({
			T: copyTree(T),
			description: `Bottom-up pass: Node with key ${x.key} has two red children. We move the red 
			color up the tree.`,
			xId: `n-${x.key}`,
		});
		colorFlip(T, x);
	}
	return x;
}

export function llrbInsert(T, key, steps) {
	steps.push({
		T: copyTree(T),
		description: `Adding a red node with key ${key} according to rules of binary search trees.`,
	});
	const z = createNode(T, key);
	T.root = llrbInsertRec(T, T.root, z, T.NIL, steps);
	if (T.root.color === RED) {
		steps.push({
			T: copyTree(T),
			description: `We color the root black to satisfy the properties of the tree.`,
			xId: `n-${T.root.key}`,
		});
		T.root.color = BLACK;
	}
	steps.push({
		T,
		description: "Done.",
	});
}

function llrbInsertRec(T, x, z, p, steps) {
	if (x === T.NIL) {
		z.p = p;
		return z;
	}
	if (z.key < x.key) {
		x.left = llrbInsertRec(T, x.left, z, x, steps);
	} else {
		x.right = llrbInsertRec(T, x.right, z, x, steps);
	}

	return llrbFixup(T, x, steps);
}

function moveRedLeft(T, x, steps) {
	steps.push({
		T: copyTree(T),
		description: "Moving red node to the left: color flip.",
		xId: `n-${x.key}`,
	});
	colorFlip(T, x);
	if (x.right.left.color === RED) {
		steps.push({
			T: copyTree(T),
			description: "Moving red node to the left, correction: first rotation.",
			xId: `n-${x.key}`,
			rotate: { dir: RIGHT, key: x.right.key },
		});
		x.right = llrbRightRotate(T, x.right);
		steps.push({
			T: copyTree(T),
			description: "Moving red node to the left, correction: second rotation.",
			xId: `n-${x.key}`,
			rotate: { dir: LEFT, key: x.key },
		});
		x = llrbLeftRotate(T, x);
		steps.push({
			T: copyTree(T),
			description: "Moving red node to the left, correction: color flip.",
			xId: `n-${x.key}`,
		});
		colorFlip(T, x);
	}
	return x;
}

function moveRedRight(T, x, steps) {
	steps.push({
		T: copyTree(T),
		description: "Moving red node to the right: color flip.",
		xId: `n-${x.key}`,
	});
	colorFlip(T, x);
	if (x.left.left.color === RED) {
		steps.push({
			T: copyTree(T),
			description: "Moving red node to the right, correction: right rotation.",
			xId: `n-${x.key}`,
			rotate: { dir: RIGHT, key: x.key },
		});
		x = llrbRightRotate(T, x);
		steps.push({
			T: copyTree(T),
			description: "Moving red node to the right, correction: color flip.",
			xId: `n-${x.key}`,
		});
		colorFlip(T, x);
	}
	return x;
}

function llrbDeleteMin(T, x, steps) {
	if (x.left === T.NIL) {
		steps.push({
			T: copyTree(T),
			description: `Deleting the successor: We are at the successor so we can simply delete 
			the node.`,
			xId: `n-${x.key}`,
		});
		x.p = T.NIL;
		return T.NIL;
	}
	if (x.left.color !== RED && x.left.left.color !== RED) {
		steps.push({
			T: copyTree(T),
			description: "Deleting the successor: We need to move a red node to the left so we can proceed there.",
			xId: `n-${x.key}`,
		});
		x = moveRedLeft(T, x, steps);
	}
	steps.push({
		T: copyTree(T),
		description: "Deleting the successor: We proceed to the left.",
		xId: `n-${x.key}`,
	});
	x.left = llrbDeleteMin(T, x.left, steps);
	return llrbFixup(T, x, steps);
}

export function llrbDelete(T, key, steps) {
	steps.push({
		T: copyTree(T),
		description: `Deleting node with key ${key}. We first search for the node.`,
	});
	T.root = llrbDeleteRec(T, T.root, key, steps);
	if (T.root.color === RED) {
		steps.push({
			T: copyTree(T),
			description: `We color the root black to satisfy the properties of the tree.`,
			xId: `n-${T.root.key}`,
		});
		T.root.color = BLACK;
	}
	steps.push({
		T,
		description: "Done.",
	});
}

function llrbDeleteRec(T, x, key, steps) {
	if (key < x.key) {
		if (x.left.color !== RED && x.left.left.color !== RED) {
			steps.push({
				T: copyTree(T),
				description: `Top-bottom pass: ${key} < ${x.key}, we move a red node to the left so we can proceed there.`,
				xId: `n-${x.key}`,
			});
			x = moveRedLeft(T, x, steps);
		}
		steps.push({
			T: copyTree(T),
			description: `Top-bottom pass: ${key} < ${x.key}. We proceed to the left.`,
			xId: `n-${x.key}`,
		});
		x.left = llrbDeleteRec(T, x.left, key, steps);
	} else {
		if (x.left.color === RED) {
			steps.push({
				T: copyTree(T),
                description: `Top-bottom pass: ${key} >= ${x.key}. We rotate the left red child to the right so we can proceed there. ${key === x.key ?
                    "The node will be replaced by its successor in the next steps." : ""}`,
				xId: `n-${x.key}`,
				rotate: { dir: RIGHT, key: x.key },
			});
			x = llrbRightRotate(T, x);
		}
		if (key === x.key && x.right === T.NIL) {
			steps.push({
				T: copyTree(T),
				description: `Top-bottom pass: ${key} = ${x.key}. The searched node is red and has no 
				children, we can simply delete it.`,
				xId: `n-${x.key}`,
			});
			x.p = T.NIL;
			return T.NIL;
		}
		if (x.right.color !== RED && x.right.left.color !== RED) {
			steps.push({
				T: copyTree(T),
				description: `Top-bottom pass: ${key} >= ${x.key}. We move 
				a red node to the right so we can proceed there. ${key == x.key ?
                        "We will proceed to the right in the next steps to delete the successor." : ""}`,
				xId: `n-${x.key}`,
			});
			x = moveRedRight(T, x, steps);
		}

		if (key === x.key) {
			let succ = minimum(T, x.right);
			steps.push({
				T: copyTree(T),
				description: `Top-bottom pass: ${key} = ${x.key}. We replace the node with its successor 
				${succ.key}, and move to the right to delete the successor.`,
				xId: `n-${x.key}`,
			});
			x.key = succ.key;
			succ.key *= -1;
			x.right = llrbDeleteMin(T, x.right, steps);
		} else {
			steps.push({
				T: copyTree(T),
				description: `Top-bottom pass: ${key} > ${x.key}. We proceed to the right.`,
				xId: `n-${x.key}`,
			});
			x.right = llrbDeleteRec(T, x.right, key, steps);
		}
	}
	return llrbFixup(T, x, steps);
}
