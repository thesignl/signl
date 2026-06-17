'use client'

import {

 deleteUser

}
from '@/services/admin.service'

export default function
AuthorTable({

 authors

}: any) {

 const remove =
 async (
  id: string
 ) => {

  await deleteUser(id)

  location.reload()
 }

 return (

  <table>

   <thead>

    <tr>

     <th>Name</th>

     <th>Articles</th>

     <th>Actions</th>

    </tr>

   </thead>

   <tbody>

    {authors.map(
      (author: any) => (

      <tr
       key={author.id}
      >

       <td>
        {author.name}
       </td>

       <td>
        {
         author._count
          .articles
        }
       </td>

       <td>

        <button

         onClick={() =>

          remove(
           author.id
          )
         }
        >

         Delete

        </button>

       </td>

      </tr>
    ))}

   </tbody>

  </table>
 )
}