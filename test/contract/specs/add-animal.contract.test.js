import { getProvider } from './init-pact';
import { AnimalController } from "../../../controllers";
import { Matchers } from "@pact-foundation/pact";

const provider = getProvider();
describe('Given An Animal Service', () => {
    const animalMock = {
        name: "Manchitas",
        breed: "Crillo",
        gender: "Female",
        vaccinated:true,
    }

    beforeAll(async ()=>{
        await provider.setup();
    });

    describe('When a request the animals create', () =>{
        beforeAll(async ()=>{
            await provider.addInteraction({
                uponReceiving: 'a request to get the animal created',
                state:"create animal",
                withRequest: {
                    method: 'POST',
                    path: '/animals',
                    body: animalMock,
                },
                willRespondWith: {
                    status:201,
                    body: Matchers.like(animalMock),
                }
            });
        });
        it("Then it should return the right data", async() => {
            const response = await AnimalController.register(animalMock);
            expect(response.data).toMatchSnapshot();
            await provider.verify();
        });
    });
    afterAll(async ()=>{
        await provider.finalize();
    });
});
