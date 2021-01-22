'use strict';

const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const markdownToStructuredText = require('./utils/markdownToStructuredText');
const createStructuredTextField = require('./utils/createStructuredTextField');
const modularContentToStructuredText = require('./utils/modularContentToStructuredText');
const getAllRecords = require('./utils/getAllRecords');

module.exports = async (client) => {
  const itemTypesByApiKey = await getItemTypesByApiKey(client);

  const contentField = await client.fields.find('blog_post::content');

  await createStructuredTextField(
    client,
    'blog_post',
    'Content (structured-text)',
    'structured_text_content',
    contentField.validators.richTextBlocks.itemTypes,
  );
  await createStructuredTextField(
    client,
    'blog_post',
    'Excerpt (structured-text)',
    'structured_text_excerpt',
  );

  const records = await getAllRecords(client, 'blog_post');

  for (const record of records) {
    console.log(`Record #${record.id}`);

    await client.items.update(record.id, {
      structuredTextContent: await modularContentToStructuredText(
        record.content,
        itemTypesByApiKey,
      ),
      structuredTextExcerpt: await markdownToStructuredText(record.excerpt),
    });

    if (record.meta.status !== 'draft') {
      console.log('Republish!');
      await client.items.publish(record.id);
    }
  }
};
