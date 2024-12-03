export default class PathFinderBTS
{
    constructor(board,rowSize,colSize)
    {
        this.#size_x = rowSize;
        this.#size_y = colSize;
        this.#boardCopy = [...board.map((element)=>{return [...element]})];
    }

    doYouKnowTheWay(startPos, endPos)
    {
        //---------------------------------------------------------------------------
        //clear all vulnerable places
        this.#prev = new Array(this.#size_y).fill(null).map( () => new Array(this.#size_x).fill(null)); 
        this.#path = [];
        this.#queue = [];
        this.#visited = [...this.#boardCopy.map((element)=>{return [...element]})] //reset visited places
        //---------------------------------------------------------------------------

        this.bts(startPos, endPos);
        return this.getPath(endPos);
    }

    bts(startPos, endPos) 
    {
        this.#queue.push(startPos); //send as first our start position (row,col)
        this.#visited[startPos.row][startPos.col] = -2; //marked position (row,col) as visited by algorithm

        while (this.#queue.length > 0) 
        {
            //set "node" represent (row,col) pos
            let node = this.#queue.shift();

            // If we have reached the end position, stop
            if(node.row === endPos.row && node.col === endPos.col) 
            {
                return;  // Exit the function
            }

            let neighbours = this.findNeighbours(node); //return array with objects represent (row,col) pos of node's neighbours

            //add to queue all non-visited neighbours
            neighbours.forEach((next) => 
                {
                    if (this.#visited[next.row][next.col] == 0) //0 mean is not visited
                    {
                        this.#queue.push(next);
                        this.#visited[next.row][next.col] = -2;
                        this.#prev[next.row][next.col] = node; //save as obj with pos
                    }
                }
            );
        }
    }

    findNeighbours(nodePos) 
    {
        let array = [];
        //return up
        if (nodePos.row > 0) {
            array.push({ row: nodePos.row - 1, col: nodePos.col })
        }

        //add right
        if (nodePos.col < (this.#size_x - 1)) {
            array.push({ row: nodePos.row, col: nodePos.col + 1 })
        }

        //add down
        if (nodePos.row < (this.#size_y - 1)) {
            array.push({ row: nodePos.row + 1, col: nodePos.col })
        }

        //add left
        if (nodePos.col > 0) {
            array.push({ row: nodePos.row, col: nodePos.col - 1 })
        }
        return [...array];
    }

    getPath(endPos) 
    {
        // Trace back from the end position to the start
        for (let at = endPos; at != null; at = this.#prev[at.row][at.col]) {
            this.#path.push(at);
        }

        // The path is now in reverse order, so reverse it
        this.#path.reverse();

        return [...this.#path];
    }

    clearFinder()
    {
        this.#size_x = undefined;
        this.#size_y = undefined;
        this.#path = [];
        this.#visited = [];
        this.#prev = [];
        this.#queue = [];
    }

    #size_x = undefined;
    #size_y = undefined;
    #visited = [];
    #boardCopy = [];
    #path = [];
    #prev = [];
    #queue = [];
}
