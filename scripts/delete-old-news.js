require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function deleteOldNews() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri || !dbName) {
    console.error('❌ Erro: MONGODB_URI ou MONGODB_DB_NAME não encontrados no .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log('🔍 Conectando ao MongoDB...\n');
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('news_articles');

    // Contar notícias antigas (com campo 'url')
    const oldCount = await collection.countDocuments({ url: { $exists: true } });
    console.log(`📰 Notícias antigas do NewsAPI encontradas: ${oldCount}`);

    // Contar notícias manuais (sem campo 'url')
    const manualCount = await collection.countDocuments({ url: { $exists: false } });
    console.log(`✅ Notícias criadas manualmente: ${manualCount}\n`);

    if (oldCount === 0) {
      console.log('✨ Banco já está limpo! Nenhuma notícia antiga para deletar.\n');
      process.exit(0);
    }

    // Deletar notícias antigas
    console.log(`🗑️  Deletando ${oldCount} notícias antigas...`);
    const result = await collection.deleteMany({ url: { $exists: true } });

    console.log(`\n✅ Operação concluída com sucesso!`);
    console.log(`   - Notícias deletadas: ${result.deletedCount}`);
    console.log(`   - Notícias preservadas: ${manualCount}`);

    // Verificar total final
    const finalCount = await collection.countDocuments({});
    console.log(`   - Total atual no banco: ${finalCount}\n`);

  } catch (error) {
    console.error('❌ Erro ao deletar notícias:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

deleteOldNews();
