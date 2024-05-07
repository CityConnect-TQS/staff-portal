import { NavbarStaff } from '@/components/navbar'
import { TripDetailsBoard } from '@/components/tripDetails'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/tripDetails')({
  component: TripDetails,
})

function TripDetails() {

  return (
    <div>
      <NavbarStaff />
      <div>  
        <TripDetailsBoard />
      </div>
    </div>
  )
}