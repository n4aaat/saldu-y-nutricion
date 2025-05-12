import { FacebookIcon } from "../assets/icons/FacebookIcon"
import { InstagramIcon } from "../assets/icons/InstagramIcon"
import { MapIcon } from "../assets/icons/MapIcon"
import { PhoneIcon } from "../assets/icons/PhoneIcon"
import { WhatsAppIcon } from "../assets/icons/WhatsAppIcon"
import { YoutubeIcon } from "../assets/icons/YoutubeIcon"
import logo from '../assets/img/logo.png'

export const Footer = () => {
    return (
        <footer className="bg-gray-200 py-8 text-gray-700">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col gap-2 items-center">
                    <img src={logo} alt="Logo de la empresa" width={200} />
                    <p className="text-justify">
                        Investigación y enseñanza en salud pública son nuestro compromiso central.
                        Desarrollamos y ofrecemos resultados de investigación para prevenir, controlar y atender problemas
                        relevantes de la sociedad mexicana y formamos profesionales de la salud que ayuden a promover
                        condiciones de vida saludable en los diversos grupos de la población.
                    </p>
                </div>

                <div className="flex flex-col gap-2 items-center">
                    <h4 className="font-bold">INSP</h4>
                    <ul className="mt-2">
                        <li>Consultas</li>
                        <li>Preguntas Frecuentes</li>
                        <li>Acerca de</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-center">Contacto</h4>
                    <div className="flex items-center pt-4">
                        <PhoneIcon fill="#374151" />
                        <p className="ml-2">(777) 329 3000</p>
                    </div>
                    <div className="flex items-center">
                        <WhatsAppIcon fill="#374151" />
                        <p className="ml-2">Whatsapp</p>
                    </div>
                    <div className="flex items-center">
                        <MapIcon fill="#374151" />
                        <p className="ml-2">comunicacion@insp.mx</p>
                    </div>
                    <p>Universidad No. 655 Colonia Santa María Ahuacatitlán, Cerrada Los Pinos y Caminera. Cuernavaca, Morelos, México.</p>
                </div>

                <div className="flex flex-col gap-2 items-center">
                    <h4 className="font-bold">Síguenos en nuestras redes sociales</h4>
                    <div className="flex mt-2">
                        <a href="https://www.facebook.com/INSP.MX" target="_blank" rel="noopener noreferrer">
                            <FacebookIcon fill="#374151" />
                        </a>
                        <a href="https://www.youtube.com/channel/UCFVrWw1jssntcvBewVXZSlQ/featured" target="_blank" rel="noopener noreferrer">
                            <YoutubeIcon fill="#374151" />
                        </a>
                        <a href="https://www.instagram.com/insp.mx" target="_blank" rel="noopener noreferrer">
                            <InstagramIcon fill="#374151" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}