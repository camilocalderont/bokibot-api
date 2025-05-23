import { AppDataSource } from './database.module';
import { runSeeds } from './seeds';

const seedDatabase = async () => {
    try {
        await runSeeds(AppDataSource);
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
};

seedDatabase();
