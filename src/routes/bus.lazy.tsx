import { BusTable } from '@/components/busTable'
import { NavbarStaff } from '@/components/navbar'
import { getBuses } from '@/services/busService'
import { Bus } from '@/types/bus'
import { Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { MaterialSymbol } from 'react-material-symbols'

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
        <div className='grid grid-cols-4 gap-16 mx-8'>
            {busGroups?.map((group, index) => (
                <div key={index}>
                    <div className='flex flex-row justify-between'>
                        <h2 className='text-xl font-medium mb-4'>{group.company}</h2>
                        <Button variant="flat" color="primary" size="sm">
                            <MaterialSymbol icon="add" size={22} />
                        </Button>
                    </div>
                    <BusTable buses={group.buses} />
                </div>
            ))}
        </div>
        </div>
    )
}