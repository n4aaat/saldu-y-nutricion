import { Button, Card, CardFooter, Image } from "@nextui-org/react";
import kid1 from '../../assets/img/kid1.jpeg'
import kid2 from '../../assets/img/kid2.jpeg'
import adult from '../../assets/img/adult1.jpeg'
import { Footer } from "../../ui/Footer";

export const HomePage = () => {
  return (
    <>
      <div className='flex flex-wrap justify-center items-center gap-6 pt-20'>
        <Card className="w-44 h-[500px] hover:w-96 ease-in-out duration-100">
          <Image
            removeWrapper
            alt="Relaxing app background"
            className="z-0 w-full h-full object-cover"
            src={kid1}
          />
          <CardFooter className="absolute bg-black/40 bottom-0 z-10">
            <div className="flex flex-col">
              <p className="text-tiny text-white">Información para Niños</p>
              <p className="text-tiny text-white">Texto relevante sobre salud para niños</p>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-44 h-[500px] hover:w-96 ease-in-out duration-100">
          <Image
            removeWrapper
            alt="Relaxing app background"
            className="z-0 w-full h-full object-cover"
            src={kid2}
          />
          <CardFooter className="absolute bg-black/40 bottom-0 z-10">
            <div className="flex flex-col">
              <p className="text-tiny text-white">Información para Niños</p>
              <p className="text-tiny text-white">Texto relevante sobre salud para niños</p>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-44 h-[500px] hover:w-96 ease-in-out duration-500">
          <Image
            removeWrapper
            alt="Relaxing app background"
            className="z-0 w-full h-full object-cover"
            src={adult}
          />
          <CardFooter className="absolute bg-black/40 bottom-0 z-10">
            <div className="flex flex-col">
              <p className="text-tiny text-white">Información para Adultos</p>
              <p className="text-tiny text-white">Texto relevante sobre salud para adultos</p>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-3 pt-4">
        <p className="margin-auto">Información acerca de salud y nutricion para niños y adultos.</p>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-3 pt-4 pb-12">
        <Button color="primary" size="lg">Niños</Button>
        <Button color="primary" size="lg">Adultos</Button>
      </div>
    </>
  )
}