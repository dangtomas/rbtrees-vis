import { RED, BLACK, LEFT, RIGHT, RBTree, copyTree, binarySearchTreeDelete} from "./utils.js";

export class ParitySeekingRBTree extends RBTree {}

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
	return y;
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
	return y;
}

export function paritySeekingDelete(T, key, steps) {
	steps.push({
		T: copyTree(T),
		description: `Deleting node with key ${key} according to rules of binary search trees.`,
	});
	const { yOriginalColor, x } = binarySearchTreeDelete(T, key)
	if (yOriginalColor === BLACK) {
		paritySeekingFixup(T, x, steps);
	}
	steps.push({
		T,
		description: "Done.",
	});
}

export function paritySeekingFixup(T, x, steps) {
	while (x !== T.root && x.color === BLACK) {
		let y;
		if (x === x.p.left) {
			y = x.p.right;
		} else {
			y = x.p.left;
		}
		if (y.color === RED) {
			steps.push({
				T: copyTree(T),
				description: `Node ${x === T.NIL ? "NIL" : x.key} is the root of deficient subtree, 
				its brother ${y.key} is red. We proceed with case 3 to provide a black brother for 
				node ${x === T.NIL ? "NIL" : x.key} allowing us to continue with case 2.`,
				xId: x === T.NIL ? `${x === x.p.left ? "l" : "r"}-nil-${x.p.key}` : `n-${x.key}`,		
				rotate: { dir: x === x.p.left ? LEFT : RIGHT, key: x.p.key },
			});
			if (x === x.p.left) {
				leftRotate23(T, x.p);
			} else {
				rightRotate23(T, x.p);
			}
		} else {
			steps.push({
				T: copyTree(T),
				description: `Node ${x === T.NIL ? "NIL" : x.key} is the root of deficient subtree, 
				its brother ${y.key} is black. We move the deficiency one level higher by coloring 
				the brother red (case 2).`,
				xId: x === T.NIL ? `${x === x.p.left ? "l" : "r"}-nil-${x.p.key}` : `n-${x.key}`,
			});
			y.color = RED;
			x = x.p;
			x = case2Fixup(T, x, y, steps);
		}
	}
	if (x.color === RED) {
		steps.push({
			T: copyTree(T),
			description: `Node ${x === T.NIL ? "NIL" : x.key} is the root of the deficient subtree. 
			We can fix the deficiency by coloring the node black (case 1).`,
			xId: `n-${x.key}`,
		});
		x.color = BLACK;
	}
}

function case2Fixup(T, x, z, steps) {
	if (z.left.color === RED || z.right.color === RED) {
		steps.push({
			T: copyTree(T),
			description: `At least one of the children of node ${z.key} we colored red in the
			previous step is red. We proceed with a fixup, which fully resolves the deficiency.`,
			xId: `n-${x.key}`,
		});
		if (z === x.left) {
			if (z.left.color === BLACK) {
				steps.push({
					T: copyTree(T),
					description: `Case 2 Fixup: first rotation to align the red nodes.`,
					xId: `n-${x.key}`,
					rotate: { dir: LEFT, key: z.key },
				});
				leftRotate23(T, z);
			}
			steps.push({
				T: copyTree(T),
				description: `Case 2 Fixup: final rotation.`,
				xId: `n-${x.key}`,
				rotate: { dir: RIGHT, key: x.key },
			});
			rightRotate23(T, x);
		} else {
			if (z.right.color === BLACK) {
				steps.push({
					T: copyTree(T),
					description: `Case 2 Fixup: first rotation to align the red nodes.`,
					xId: `n-${x.key}`,
					rotate: { dir: RIGHT, key: z.key },
				});
				rightRotate23(T, z);
			}
			steps.push({
				T: copyTree(T),
				description: `Case 2 Fixup: final rotation.`,
				xId: `n-${x.key}`,
				rotate: { dir: LEFT, key: x.key },
			});
			leftRotate23(T, x);
		}
		x = x.p;
		steps.push({
				T: copyTree(T),
				description: `Case 2 Fixup: switching colors.`,
				xId: `n-${x.key}`,
			});
		x.left.color = BLACK;
		x.right.color = BLACK;
		x = T.root;
	}
	return x;
}
