interface IMazeBlockConstructor {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
}

class MazeBlock {
    top: boolean = true;
    right: boolean = true;
    bottom: boolean = true;
    left: boolean = true;

    constructor(options: IMazeBlockConstructor = {}){
        this.top = typeof options.top === 'boolean' ? options.top : true;
        this.right = typeof options.right === 'boolean' ? options.right : true;
        this.bottom = typeof options.bottom === 'boolean' ? options.bottom : true;
        this.left = typeof options.left === 'boolean' ? options.left : true;
    }
}

export default MazeBlock