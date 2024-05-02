import { NavbarStaff } from '@/components/navbar'
import { createLazyFileRoute } from '@tanstack/react-router'
import { ModalCreateTrip } from '@/components/modalCreateTrip'

export const Route = createLazyFileRoute('/trips')({
  component: Trips,
})

function Trips() {
  return (
    <>
    <NavbarStaff  />
    <div className='flex p-24'>
    <ModalCreateTrip />
    </div>

    </>
  )
}