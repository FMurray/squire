    // import necessary files
    import { Request, Response } from 'express';
    import fs from 'fs';

    // read the json file and parse it into an object
    const postsObj = JSON.parse(
        fs.readFileSync('./public/posts.json', 'utf8')
    );

    // get the posts in json format
    export default (req: Request, res: Response) => {
        res.status(200).json(postsObj);
    };