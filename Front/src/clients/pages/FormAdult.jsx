import adultossImage from '../../assets/img/adult1.jpeg';
export const FormAdult = () => {
    return (
        <div className="h-[90vh] bg-cover bg-no-repeat bg-center font-serif" style={{ backgroundImage: `url(${adultossImage})` }}>
            <div className="max-w-[1100px] mx-auto px-left-[30px] pt-[350px] pb-20">
                <h1 className="text-white text-3xl md:text-5xl">
                    <span className="text-red-500">Nutrición</span> <span className="text-black">en adultos</span>
                </h1>
                <p className="text-lg pb-4 text-black w-1/2">
                    Cada bocado equilibrado es una inversión en<br />
                    su crecimiento, desarrollo y felicidad.
                </p>
            </div>
        </div>
    )
}