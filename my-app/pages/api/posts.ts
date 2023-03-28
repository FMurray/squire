import type { NextApiRequest, NextApiResponse } from 'next';

type Post = {
  title: string;
  body: string;
};

const dummyData: Post[] = [
  {
    title: 'Cheese Post 1',
    body: 'This is the body of the first cheese post.',
  },
  {
    title: 'Cheese Post 2',
    body: 'This is the body of the second cheese post.',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse<Post[]>) {
  res.status(200).json(dummyData);
}