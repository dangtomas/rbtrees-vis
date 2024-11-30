import { RED, BLACK } from "./utils.js";
import { ClassicRBTree, rbInsert, rbDelete } from "./classicRb.js";
import { LLRBTree, llrbInsert, llrbDelete } from "./llrb.js";
import { RB23Tree, rb23Insert, rb23Delete } from "./paritySeeking23Rb.js";
import { RB234Tree, rb234Insert, rb234Delete } from "./paritySeeking234Rb.js";

function assert(value) {
	if (!value) {
		throw new Error();
	}
}

function rbTest() {
	const T = new ClassicRBTree();

	rbInsert(T, 77);
	assert(T.root.key === 77);
	assert(T.root.color === BLACK);

	rbInsert(T, 24);
	assert(T.root.left.key === 24);
	assert(T.root.left.color === RED);

	rbInsert(T, 49);
	assert(T.root.key === 49);
	assert(T.root.color === BLACK);
	assert(T.root.left.key === 24);
	assert(T.root.left.color === RED);
	assert(T.root.right.key === 77);
	assert(T.root.right.color === RED);

	rbInsert(T, 9);
	assert(T.root.color === BLACK);
	assert(T.root.left.color === BLACK);
	assert(T.root.right.color === BLACK);

	rbInsert(T, 36);
	rbInsert(T, 25);
	assert(T.root.left.key === 24);
	assert(T.root.left.color === RED);
	assert(T.root.left.left.color === BLACK);
	assert(T.root.left.right.color === BLACK);

	rbDelete(T, 77);
	assert(T.root.right.key === 36);
	assert(T.root.right.color === RED);
	assert(T.root.left.color === BLACK);
	assert(T.root.color === BLACK);

	rbDelete(T, 25);
	assert(T.root.right.color === BLACK);
	assert(T.root.right.right.color === RED);

	rbDelete(T, 9);
	assert(T.root.key === 36);
	assert(T.root.color === BLACK);
	assert(T.root.left.key === 24);
	assert(T.root.left.color === BLACK);
	assert(T.root.right.key === 49);
	assert(T.root.right.color === BLACK);

	console.log("RBTree - OK");
}

function llrbTest() {
	const T = new LLRBTree();

	llrbInsert(T, 25);
	assert(T.root.key === 25);
	assert(T.root.color === BLACK);

	llrbInsert(T, 99);
	assert(T.root.key === 99);
	assert(T.root.color === BLACK);
	assert(T.root.left.color === RED);

	llrbInsert(T, 12);
	assert(T.root.key === 25);
	assert(T.root.color === BLACK);
	assert(T.root.left.color === BLACK);
	assert(T.root.right.color === BLACK);

	llrbInsert(T, 7);
	llrbInsert(T, 20);
	assert(T.root.left.color === RED);

	llrbInsert(T, 69);
	llrbInsert(T, 40);
	assert(T.root.key === 25);
	assert(T.root.color === BLACK);
	assert(T.root.right.key === 69);
	assert(T.root.right.color === BLACK);
	assert(T.root.left.color === BLACK);

	llrbDelete(T, 25);
	assert(T.root.key === 40);
	assert(T.root.color === BLACK);
	assert(T.root.left.color === RED);
	assert(T.root.right.key === 99);
	assert(T.root.right.left.color === RED);

	llrbDelete(T, 20);
	assert(T.root.color === BLACK);
	assert(T.root.left.color === BLACK);
	assert(T.root.left.left.color === RED);

	llrbDelete(T, 40);
	assert(T.root.color === BLACK);
	assert(T.root.key === 69);
	assert(T.root.left.color === BLACK);
	assert(T.root.right.color === BLACK);

	llrbDelete(T, 99);
	assert(T.root.key === 12);
	assert(T.root.color === BLACK);
	assert(T.root.left.color === BLACK);
	assert(T.root.right.color === BLACK);

	llrbDelete(T, 7);
	assert(T.root.key === 69);
	assert(T.root.right === T.NIL);
	assert(T.root.left.key === 12);
	assert(T.root.left.color === RED);

	llrbDelete(T, 69);
	assert(T.root.key === 12);
	assert(T.root.color === BLACK);

	console.log("LLRBTree - OK");
}

function rb23Test() {
	const T = new RB23Tree();

	rb23Insert(T, 69);
	assert(T.root.key == 69);
	assert(T.root.color == BLACK);
	assert(T.root.left == T.NIL);

	rb23Insert(T, 44);
	assert(T.root.color == BLACK);
	assert(T.root.left.color == RED);

	rb23Insert(T, 52);
	assert(T.root.key == 52);
	assert(T.root.color == BLACK);
	assert(T.root.left.color == BLACK);
	assert(T.root.right.color == BLACK);

	rb23Insert(T, 99);
	rb23Insert(T, 77);
	assert(T.root.right.key == 77);
	assert(T.root.right.color == RED);
	assert(T.root.right.left.color == BLACK);
	assert(T.root.right.right.color == BLACK);

	rb23Insert(T, 20);
	rb23Insert(T, 48);
	assert(T.root.color == BLACK);
	assert(T.root.left.color == BLACK);
	assert(T.root.right.color == BLACK);

	rb23Delete(T, 52);
	assert(T.root.key == 69);
	assert(T.root.color == BLACK);
	assert(T.root.right.color == BLACK);
	assert(T.root.right.right.color == RED);
	assert(T.root.left.color == RED);

	rb23Delete(T, 77);
	assert(T.root.key == 69);
	assert(T.root.color == BLACK);
	assert(T.root.right.color == BLACK);
	assert(T.root.left.color == RED);

	rb23Delete(T, 48);
	assert(T.root.color == BLACK);
	assert(T.root.left.color == BLACK);
	assert(T.root.left.left.color == RED);

	rb23Delete(T, 99);
	assert(T.root.key == 44);
	assert(T.root.color == BLACK);
	assert(T.root.left.color == BLACK);
	assert(T.root.right.color == BLACK);

	rb23Delete(T, 69);
	assert(T.root.left.color == RED);

	console.log("2-3 RBTree - OK");
}

function rb234Test() {
	const T = new RB234Tree();

	rb234Insert(T, 77);
	assert(T.root.key == 77);
	assert(T.root.color == BLACK);

	rb234Insert(T, 24);
	assert(T.root.left.key == 24);
	assert(T.root.left.color == RED);

	rb234Insert(T, 49);
	assert(T.root.key == 49);
	assert(T.root.color == BLACK);
	assert(T.root.left.key == 24);
	assert(T.root.left.color == RED);
	assert(T.root.right.key == 77);
	assert(T.root.right.color == RED);

	rb234Insert(T, 9);
	assert(T.root.color == BLACK);
	assert(T.root.left.color == BLACK);
	assert(T.root.right.color == BLACK);

	rb234Insert(T, 36);
	rb234Insert(T, 25);
	assert(T.root.left.key == 24);
	assert(T.root.left.color == RED);
	assert(T.root.left.left.color == BLACK);
	assert(T.root.left.right.color == BLACK);

	rb234Delete(T, 77);
	assert(T.root.right.key == 36);
	assert(T.root.right.color == RED);
	assert(T.root.left.color == BLACK);
	assert(T.root.color == BLACK);

	rb234Delete(T, 25);
	assert(T.root.right.color == BLACK);
	assert(T.root.right.right.color == RED);

	rb234Delete(T, 9);
	assert(T.root.key == 36);
	assert(T.root.color == BLACK);
	assert(T.root.left.key == 24);
	assert(T.root.left.color == BLACK);
	assert(T.root.right.key == 49);
	assert(T.root.right.color == BLACK);

	console.log("RB234Tree - OK");
}

rbTest();
llrbTest();
rb23Test();
rb234Test();
