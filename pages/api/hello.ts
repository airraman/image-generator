// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string, 
  address: string,
  age: number, 
  salary: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ 
    name: 'Raman Emmanuel Mama', 
    address: "Florida", 
    age: 25, 
    salary: 150000
 })
}
