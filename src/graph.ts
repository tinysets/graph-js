
function swap(arr: any[], a: number, b: number) {
    let tmp = arr[a];
    arr[a] = arr[b];
    arr[b] = tmp;
    return;
}

class HeapItem<T> {
    key: number;
    value: T;
    constructor(key: number, value: T) {
        this.key = key;
        this.value = value;
    }
}

export class Heap<T> {
    // 大顶堆
    private arr: HeapItem<T>[] = [];

    size() {
        return this.arr.length;
    }

    is_max_heap() {
        this._is_max_heap(this.arr, this.arr.length);
    }

    private _is_max_heap(arr: HeapItem<T>[], length: number) {
        if (length >= 2) {
            let maxIndex = Math.floor(length / 2 - 1); // 最后一个非叶子节点
            for (let i = 0; i <= maxIndex; i++) {
                if (arr[i].key < arr[2 * i + 1].key) {
                    console.error("不是大顶堆");
                    return false;
                }
                if ((2 * i + 2) <= length - 1) {
                    if (arr[i].key < arr[2 * i + 2].key) {
                        console.error("不是大顶堆");
                        return false;
                    }
                }
            }
        }
        return true;
    }


    push(key: number, value: T = null) {
        let item = new HeapItem<T>(key, value);
        this.arr.push(item);
        this.heapify_up(this.arr, this.arr.length, this.arr.length - 1);
    }

    private heapify_up(arr: HeapItem<T>[], length: number, index: number) {
        while (1) {
            let p = Math.floor((index - 1) / 2);
            if (length >= 2 && p >= 0) {
                if (arr[index].key > arr[p].key) {
                    swap(arr, index, p);
                    index = p;
                    continue;
                }
            }
            break;
        }
    }

    top() {
        return this.arr[0];
    }

    pop() {
        if (this.arr.length >= 2) {
            let tmp = this.arr[0];
            this.arr[0] = this.arr.pop();
            this.heapify_down(this.arr, this.arr.length, 0);
            return tmp;
        } else {
            return this.arr.pop();
        }
    }

    private heapify_down(arr: HeapItem<T>[], length: number, i: number) {
        while (1) {
            let left = 2 * i + 1;
            let right = 2 * i + 2;

            let max = i;
            if (left <= length - 1) {
                if (arr[max].key < arr[left].key) {
                    max = left;
                }
                if (right <= length - 1) {
                    if (arr[max].key < arr[right].key) {
                        max = right;
                    }
                }
            }

            if (max != i) {
                swap(arr, max, i);
                i = max;
                continue;
            }
            break;
        }
    }

}

let edge_data: [number, number, number][] = [
    [0, 1, 10],
    [0, 5, 11],
    [1, 6, 16],
    [1, 2, 18],
    [1, 8, 12],
    [2, 8, 8],
    [2, 3, 22],
    [3, 8, 21],
    [3, 6, 24],
    [3, 7, 16],
    [3, 4, 20],
    [4, 7, 7],
    [4, 5, 26],
    [5, 6, 17],
    [6, 7, 19],
];

edge_data = [
    [0, 1, 1],
    [0, 2, 5],
    [1, 2, 3],
    [1, 3, 7],
    [1, 4, 5],
    [2, 4, 1],
    [2, 5, 7],
    [3, 4, 2],
    [4, 5, 3],
    [3, 6, 3],
    [4, 6, 6],
    [4, 7, 9],
    [5, 7, 5],
    [6, 7, 2],
    [6, 8, 7],
    [7, 8, 4],
];

let edge_data1: [number, number, number][] = [
    [0, 1, 3],// 0
    [0, 2, 4],// 1
    [1, 3, 5],// 2
    [1, 4, 6],// 3
    [2, 3, 8],// 4
    [2, 5, 7],// 5
    [3, 4, 3],// 6
    [4, 6, 9],// 7
    [4, 7, 4],// 8
    [5, 7, 6],// 9
    [6, 9, 2],// 10
    [7, 8, 5],// 11
    [8, 9, 3],// 12
];

let edge_data2: [number, number, number][] = [ // circle
    [0, 1, 3],
    [1, 2, 4],
    [2, 3, 5],
    [3, 0, 6],
];


class Edge {// 边集数组方式定义图
    begin: number;
    end: number;
    weight: number;
    constructor(begin: number, end: number, weight: number) {
        this.begin = begin;
        this.end = end;
        this.weight = weight;
    }
}

export class Graph {
    edges: Edge[] = [];
    constructor() {
        this.init(edge_data);
    }

    init(edges_data: [number, number, number][]) {
        this.edges = [];
        for (const data of edges_data) {
            this.insert(data[0], data[1], data[2]);
        }
    }

    private insert(begin: number, end: number, weight: number) {
        this.edges.push(new Edge(begin, end, weight));
    }

    private getV(): number[] {
        let V = [];
        for (const e of this.edges) {
            if (V.indexOf(e.begin) == -1) {
                V.push(e.begin);
            }
            if (V.indexOf(e.end) == -1) {
                V.push(e.end);
            }
        }
        return V;
    }

    private remove(arr: number[], num: number) {
        let index = arr.indexOf(num);
        if (index != -1) {
            arr.splice(index, 1);
        }
    }

    private contains(arr: number[], num: number) {
        let index = arr.indexOf(num);
        return index != -1;
    }

    private equal(arr1: number[], arr2: number[]) {
        return arr1.length == arr2.length;
    }

    prim() {
        // N=(V,E) 为联通网  TE是N上的最小生成树边的集合，V为顶点的集合,E为边的集合
        // 算法从 U={u0} u0∈V 开始 TE={}开始
        // 重复执行如下操作：在所有边属于e=(u,x)∈E,u∈U,x∈V-U,找到权值最小的边e0=(u0,x)
        // e0加入TE，x且将加入U，直到U=V时候停止。 T=(U,TE)为最小生成树
        let V = this.getV();
        let X = this.getV();
        let TE: Edge[] = [];
        let U = [];

        let first = X[0]
        U.push(first);
        this.remove(X, first);

        while (!this.equal(U, V)) {
            let ok_edges: Edge[] = [];
            for (const e of this.edges) {
                if (this.contains(U, e.begin) && this.contains(X, e.end)) {
                    ok_edges.push(e);
                } else if (this.contains(U, e.end) && this.contains(X, e.begin)) {
                    ok_edges.push(e);
                }
            }

            if (ok_edges.length != 0) {
                let min_e = ok_edges[0];
                for (const e of ok_edges) {
                    if (min_e.weight > e.weight) {
                        min_e = e;
                    }
                }
                if (this.contains(U, min_e.begin)) {
                    TE.push(min_e);
                    U.push(min_e.end);
                    this.remove(X, min_e.end);
                } else {
                    TE.push(min_e);
                    U.push(min_e.begin);
                    this.remove(X, min_e.begin);
                }
            } else {
                break;// 没有找到
            }
        }
        console.log(TE);
    }

    kruskal() {
        // http://data.biancheng.net/view/41.html
        // 1).在初始状态下给每个顶点赋予不同的标记，对于遍历过程的每条边，其都有两个顶点，
        // 判断这两个顶点的标记是否一致，如果一致，说明它们本身就处在一棵树中，如果继续连接就会产生回路；
        // 如果不一致，说明它们之间还没有任何关系，可以连接.
        // 2).假设遍历到一条由顶点 A 和 B 构成的边，而顶点 A 和顶点 B 标记不同，
        // 此时不仅需要将顶点 A 的标记更新为顶点 B 的标记，
        // 还需要更改所有和顶点 A 标记相同的顶点的标记，全部改为顶点 B 的标记。

        this.edges.sort((a, b) => a.weight - b.weight);

        let V = this.getV();
        let flags: { [key: number]: number } = {};
        for (const v of V) {
            flags[v] = v;
        }

        let min_tree: Edge[] = [];
        for (const e of this.edges) {
            if (flags[e.begin] != flags[e.end]) {// 标记不同
                min_tree.push(e);
                let src_flag = flags[e.begin];
                let tar_flag = flags[e.end];
                for (const key in flags) {
                    if (flags[key] == src_flag) {
                        flags[key] = tar_flag;
                    }
                }
            }
        }
        console.log(min_tree);
    }

    kruskal_optimized() {
        this.edges.sort((a, b) => a.weight - b.weight);

        let V = this.getV();

        let flags = []; //  巧妙是使用静态链表作为标记
        for (let i = 0; i < V.length; i++) {
            flags.push(0);
        }

        let get_flag = (flags: number[], index: number) => {
            while (flags[index] != 0) {
                index = flags[index];
            }
            return index;
        }

        let min_tree: Edge[] = [];
        for (const e of this.edges) {
            let begin_flag = get_flag(flags, e.begin);
            let end_flag = get_flag(flags, e.end);
            if (begin_flag != end_flag) {// 标记不同
                min_tree.push(e);
                flags[begin_flag] = e.end;
            }
        }

        console.log(min_tree);
    }

    get_matrix() {
        let V = this.getV();
        let mat: number[][] = [];
        for (let i = 0; i < V.length; i++) {
            mat[i] = [];
            for (let j = 0; j < V.length; j++) {
                mat[i][j] = Number.MAX_VALUE;
                if (i == j) {
                    mat[i][j] = 0;
                }
            }
        }

        for (const e of this.edges) {
            mat[e.begin][e.end] = e.weight;
            mat[e.end][e.begin] = e.weight;
        }
        return mat;
    }

    dijkstra() {
        // 最短路径  迪科斯特拉 贪心
        // https://www.cnblogs.com/kamimxr/p/11213019.html

        let mat = this.get_matrix();

        let start = 0;
        let end = 7;

        let V = this.getV();
        let dis = mat[start].slice();


        let flags = [];
        for (let i = 0; i < V.length; i++) {
            flags.push(0);
        }
        flags[start] = 1;

        let prev = [];
        for (let i = 0; i < V.length; i++) {
            prev.push(start);
        }

        for (let i = 0; i < V.length; i++) {
            let min = Number.MAX_VALUE;
            let minIndex = 0;
            for (let j = 0; j < V.length; j++) {
                if (!flags[j] && dis[j] < min) {
                    min = dis[j];
                    minIndex = j;
                }
            }
            flags[minIndex] = 1;
            for (let j = 0; j < V.length; j++) {
                if (!flags[j] && min + mat[minIndex][j] < dis[j]) {
                    // 找到了更短的路径
                    dis[j] = min + mat[minIndex][j];
                    prev[j] = minIndex;
                }
            }
        }

        let path = [];
        let curr = end;
        path.push(curr);
        do {
            curr = prev[curr];
            path.push(curr);
        } while (curr != start);
        path = path.reverse();
        console.log(path);

        // console.log(prev);
        console.log(dis);
        console.log(dis[end]);
    }

    dijkstra_optimized() {

        let mat = this.get_matrix();

        let start = 0;
        let end = 7;

        let V = this.getV();
        let dis: number[] = [];
        for (let i = 0; i < V.length; i++) {
            dis.push(Number.MAX_VALUE);
        }

        let flags = [];
        for (let i = 0; i < V.length; i++) {
            flags.push(0);
        }

        let prev = [];
        for (let i = 0; i < V.length; i++) {
            prev.push(start);
        }

        let heap = new Heap<number>();
        heap.push(0, start);
        dis[start] = 0;

        while (heap.size() > 0) {
            let top = heap.pop();
            let min = -top.key;
            let minIndex = top.value;
            if (flags[minIndex]) {
                continue;
            }
            flags[minIndex] = 1;

            for (let j = 0; j < V.length; j++) { // 换成邻接表效率更高
                if (!flags[j] && min + mat[minIndex][j] < dis[j]) {
                    dis[j] = min + mat[minIndex][j];// 找到了更短的路径
                    prev[j] = minIndex;
                    heap.push(-dis[j], j);
                }
            }
        }

        console.log(prev);
        console.log(dis);
        console.log(dis[end]);
    }

    floyd() {
        // https://www.cnblogs.com/wangyuliang/p/9216365.html
        let mat = this.get_matrix();

        let start = 0;
        let end = 7;

        let V = this.getV();

        for (let mid = 0; mid < V.length; mid++) {
            for (let start = 0; start < V.length; start++) {
                for (let end = 0; end < V.length; end++) {
                    if (mat[start][mid] + mat[mid][end] < mat[start][end]) {
                        mat[start][end] = mat[start][mid] + mat[mid][end];
                    }
                }
            }
        }
        console.log(mat[start][end]);
    }


    get_outgoingEdges() {
        let V = this.getV();
        let outgoingEdges: Map<number, Set<number>> = new Map();
        for (const v of V) {
            outgoingEdges.set(v, new Set<number>());
        }
        for (const e of this.edges) {
            outgoingEdges.get(e.begin).add(e.end);
        }
        return outgoingEdges;
    }

    get_incomingEdges() {
        let V = this.getV();
        let incomingEdges: Map<number, Set<number>> = new Map();
        for (const v of V) {
            incomingEdges.set(v, new Set<number>());
        }

        for (const e of this.edges) {
            incomingEdges.get(e.end).add(e.begin)
        }
        return incomingEdges;
    }

    topo() {
        this.init(edge_data1);

        let outgoingEdges = this.get_outgoingEdges();
        let incomingEdges = this.get_incomingEdges();

        let queue = [];

        for (const k of incomingEdges.keys()) {
            if (incomingEdges.get(k).size == 0) {
                queue.push(k)
                incomingEdges.delete(k);
                break;
            }
        }

        let seq = [];

        while (queue.length > 0) {
            let forRemove: number = queue.shift();
            seq.push(forRemove);

            let outgoingEdge = outgoingEdges.get(forRemove);
            outgoingEdges.delete(forRemove);

            for (const outgoing of outgoingEdge) {
                let incomingEdge = incomingEdges.get(outgoing);
                incomingEdge.delete(forRemove);
                if (incomingEdge.size == 0) {
                    incomingEdges.delete(outgoing);
                    queue.push(outgoing);
                }
            }
        }

        console.log(seq);
        return seq;
    }

    aoe_contain_Cycle() {
        // aoe 是否存在环？
        // 给定一个顶点 是否形成环路？
        // 查看 它的出边能否到达它的入边 ，即 (它指向的顶点)是否有到达(指向它的顶点)的路径
        this.init(edge_data2);

        let V = this.getV();
        let outgoingEdges = this.get_outgoingEdges();
        let incomingEdges = this.get_incomingEdges();
        for (const v of V) {
            let outgoings = outgoingEdges.get(v);
            let incomings = incomingEdges.get(v);
            for (const outgoing of outgoings) {
                for (const incoming of incomings) {
                    let hasPath = this.aoe_has_path(outgoing, incoming, outgoingEdges);
                    if (hasPath) {
                        console.error("aoe_contain_Cycle");
                        return true;
                    }
                }
            }
        }
        return false;
    }

    aoe_has_path(start: number, end: number, outgoingEdges: Map<number, Set<number>>) {
        // 广度遍历
        let queue: number[] = [];
        queue.push(start);
        let has_arrive = new Set<number>();
        has_arrive.add(start);
        while (queue.length > 0) {
            let top = queue.shift();
            if (top == end) {
                return true;
            }
            let outgoings = outgoingEdges.get(top);
            for (const outgoing of outgoings) {
                if (!has_arrive.has(outgoing)) { // 存在环
                    queue.push(outgoing);
                    has_arrive.add(outgoing);
                }
            }
        }

        return false;
    }


    get_matrix_aoe() {
        let V = this.getV();
        let mat: number[][] = [];
        for (let i = 0; i < V.length; i++) {
            mat[i] = [];
            for (let j = 0; j < V.length; j++) {
                mat[i][j] = Number.MAX_VALUE;
            }
        }

        for (const e of this.edges) {
            mat[e.begin][e.end] = e.weight;
        }
        return mat;
    }

    key_path() {
        // 顶点用来表示某个事件，弧用来表示活动，弧上的权值用来表示活动持续的时间.
        // 顶点表示事件的发生，边便是时间的过程
        // 事件的最早发生时间取决于它前面中最长的那个
        // 事件的最晚发生时间取决于它后面中的最早的那个  // 发生时间既不能提前也不能延后的事件是关键事件点
        // 活动的最早开始时间取决于先决它的最早发生时间
        // 活动的最晚开始时间取决于它后决的最晚发生时间  // 开始时间既不能提前也不能延后的活动是关键活动(路径)
        this.init(edge_data1);
        let V = this.getV();
        let matrix_aoe = this.get_matrix_aoe();
        let outgoingEdges = this.get_outgoingEdges();
        let incomingEdges = this.get_incomingEdges();
        let topo = this.topo();

        let early_vertex = [];
        for (let i = 0; i < V.length; i++) {
            early_vertex[i] = 0;
        }

        for (const v of topo) {
            let incoms = incomingEdges.get(v);
            if (incoms.size == 0) {
                early_vertex[v] = 0;
            } else {
                let max = 0;
                for (const incom of incoms) {
                    let weight = matrix_aoe[incom][v];
                    let totalWeight = early_vertex[incom] + weight;
                    if (max < totalWeight) {
                        max = totalWeight;
                    }
                }
                early_vertex[v] = max;
            }
        }


        let late_vertex = [];
        for (let i = 0; i < V.length; i++) {
            late_vertex[i] = Number.MAX_VALUE;
        }

        for (let i = topo.length - 1; i >= 0; i--) {
            let v = topo[i];
            let outgoings = outgoingEdges.get(v);
            if (outgoings.size == 0) {
                late_vertex[v] = early_vertex[v];
            } else {
                let min = Number.MAX_VALUE;
                for (const outgoing of outgoings) {
                    let weight = matrix_aoe[v][outgoing];
                    if (min > early_vertex[outgoing] - weight) {
                        min = early_vertex[outgoing] - weight;
                    }
                }
                late_vertex[v] = min;
            }
        }

        let keyVertex = [];

        for (let i = 0; i < early_vertex.length; i++) {
            if (early_vertex[i] == late_vertex[i]) {
                keyVertex.push(i);
            }
        }
        console.log("keyVertex", keyVertex);

        let early_edge = [];
        for (let i = 0; i < this.edges.length; i++) {
            const e = this.edges[i];
            early_edge[i] = early_vertex[e.begin];
        }

        let late_edge = [];
        for (let i = 0; i < this.edges.length; i++) {
            const e = this.edges[i];
            late_edge[i] = late_vertex[e.end] - e.weight;
        }

        let keyPath = [];
        for (let i = 0; i < early_edge.length; i++) {
            if (early_edge[i] == late_edge[i]) {
                keyPath.push(i);
            }
        }
        console.log("keyPath", keyPath);

        // early_vertex <- topo
        // late_vertex <- topo + early_vertex
        // keyVertex <- early_vertex + late_vertex

        // early_edge <- early_vertex
        // late_edge <- late_vertex
        // keyPath <- early_edge + late_edge
    }
}