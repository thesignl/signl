'use client'

import {

 deleteUser,

 updateRole

}
from '@/services/admin.service'

export default function
UserTable({

 users

}: any) {

 const changeRole =
 async (

  id: string,

  role: string

 ) => {

  await updateRole(
   id,
   role
  )

  location.reload()
 }

 const removeUser =
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

     <th>
      Name
     </th>

     <th>
      Email
     </th>

     <th>
      Role
     </th>

     <th>
      Actions
     </th>

    </tr>

   </thead>

   <tbody>

    {users.map(
     (user: any) => (

      <tr
       key={user.id}
      >

       <td>
        {user.name}
       </td>

       <td>
        {user.email}
       </td>

       <td>

        <select

         value={
          user.role
         }

         onChange={
          (e) =>

          changeRole(

           user.id,

           e.target.value
          )
         }
        >

         <option>
          USER
         </option>

         <option>
          EDITOR
         </option>

         <option>
          ADMIN
         </option>

        </select>

       </td>

       <td>

        <button

         onClick={() =>

          removeUser(
           user.id
          )
         }
        >

         Delete

        </button>

       </td>

      </tr>
     )
    )}

   </tbody>

  </table>
 )
}