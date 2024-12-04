import { RED, BLACK } from "./js-impl/utils.js";
import { ClassicRBTree, rbInsert, rbDelete } from "./js-impl/classicRb.js";
import { LLRBTree, llrbInsert, llrbDelete } from "./js-impl/llrb.js";

const style = [
	{
		selector: "node",
		style: {
			label: "data(label)",
			textValign: "center",
			textHalign: "center",
			color: "#fff",
			width: "40px",
			height: "40px",
			fontSize: "20px",
		},
	},

	{
		selector: '[type = "black"]',
		style: {
			backgroundColor: "#000",
		},
	},

	{
		selector: '[type = "red"]',
		style: {
			backgroundColor: "red",
		},
	},

	{
		selector: '[type = "nil"]',
		style: {
			label: "NIL",
			color: "black",
			backgroundColor: "white",
			fontSize: "15px",
		},
	},

	{
		selector: "edge",
		style: {
			width: 2,
			"line-color": "#000",
			"curve-style": "bezier",
			"target-arrow-color": "#000",
			"target-arrow-shape": "triangle",
		},
	},
];

function visualizeTree(T, x, cy, pid, isLeft) {
	const id =
		x === T.NIL
			? pid === null
				? "root"
				: `${isLeft ? "l" : "r"}-nil-${pid.split("-")[1]}`
			: `n-${x.key}`;
	cy.add({
		group: "nodes",
		data: {
			id,
			label: x === T.NIL ? "NIL" : x.key,
			type: x === T.NIL ? "nil" : x.color === RED ? "red" : "black",
		},
		grabbable: false,
	});
	if (pid !== null) {
		cy.add({
			group: "edges",
			data: {
				source: pid,
				target: id,
			},
		});
	}
	if (x !== T.NIL) {
		visualizeTree(T, x.left, cy, id, true);
		visualizeTree(T, x.right, cy, id, false);
	}
}

const cyClassicRb = cytoscape({
	container: document.getElementById("classic-rb"),
	style,
});

let T = new ClassicRBTree();
for (let i = 0; i < 20; i++) {
	rbInsert(T, i);
}

visualizeTree(T, T.root, cyClassicRb, null, null);

cyClassicRb.layout({ name: "dagre" }).run();
