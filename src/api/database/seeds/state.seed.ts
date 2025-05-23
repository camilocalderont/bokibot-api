import { DataSource } from 'typeorm';
import { StateEntity } from '../../modules/appointment/entities/state.entity';

export const statesSeed = async (dataSource: DataSource): Promise<void> => {
    const stateRepository = dataSource.getRepository(StateEntity);
    
    const existingStates = await stateRepository.find();
    if (existingStates.length > 0) {
        return;
    }

    const states = [
        {
            VcName: 'Creada'
        },
        {
            VcName: 'Confirmada'
        },
        {
            VcName: 'Cancelada'
        },
        {
            VcName: 'Reagendada'
        }
    ];
    await stateRepository.insert(states);
};
