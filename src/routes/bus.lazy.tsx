import { BusTable } from '@/components/busTable'
import { ModalCreateBus } from '@/components/modalCreateBus'
import { NavbarStaff } from '@/components/navbar'
import { getBuses } from '@/services/busService'
import { Bus } from '@/types/bus'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Chip } from '@nextui-org/react'

export const Route = createLazyFileRoute('/bus')({
  component: Buses,
})
interface BusGroups {
    company: string,
    buses: Bus[]
}

function Buses() {

    const {data: buses, isLoading} = useQuery({
        queryKey: ["buses"],
        queryFn: getBuses,
    });

    const queryClient = useQueryClient();
    const alerts = queryClient.getQueryData<{message: string, type: "success" | "warning" , active: boolean}>(['alerts']);

    const busGroups: BusGroups[] = (buses?? []).reduce((acc: BusGroups[], bus: Bus) => {
        const existingGroup = acc.find(group => group.company === bus.company);
        if (existingGroup) {
            existingGroup.buses.push(bus);
        } else {
            acc.push({ company: bus.company, buses: [bus] });
        }
        return acc;
    }, []);


    if (isLoading || !busGroups) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col gap-16 p-2">
        <NavbarStaff />
        <div className='flex mx-8 justify-end'>
            <ModalCreateBus company="" />
        </div>
        {alerts?.active && ( 
            <Chip color={alerts.type} variant="flat" radius="sm">
                {alerts.message}
            </Chip>
        )}
        <div className='grid grid-cols-4 gap-16 mx-8'>
            {busGroups?.map((group, index) => (
                <div key={index}>
                    <div className='flex flex-row justify-between'>
                        <h2 className='text-xl font-medium mb-4'>{group.company}</h2>
                        <ModalCreateBus company={group.company} />
                    </div>
                    <BusTable buses={group.buses} />
                </div>
            ))}
        </div>
        </div>
    )
}