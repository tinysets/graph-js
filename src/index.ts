import { Graph, Heap } from "./graph";


setTimeout(() => {

    let g = new Graph();
    g.prim();
    g.kruskal();
    g.kruskal_optimized();
    g.dijkstra();
    g.dijkstra_optimized();
    g.floyd();
    g.topo();
    g.key_path();

    g.aoe_contain_Cycle();

    {
        let sortTestCount = 100;
        for (let j = 0; j < sortTestCount; j++) {
            let ranCount = 1000
            let heap = new Heap();

            for (let i = 0; i < ranCount; i++) {
                heap.push(Math.floor(Math.random() * 1000000));
                heap.is_max_heap();
            }

            for (let i = 0; i < ranCount; i++) {
                heap.pop();
                heap.is_max_heap();
            }
        }
    }

}, 1000);