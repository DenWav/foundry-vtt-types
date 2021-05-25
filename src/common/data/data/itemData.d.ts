import EmbeddedCollection from '../../abstract/embeddedCollection';
import { ConfiguredDocumentClass, FieldReturnType } from '../../abstract/helperTypes';
import { DocumentData } from '../../abstract/module';
import * as documents from '../../documents';
import * as fields from '../fields';

interface ItemDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  type: DocumentField<string> & {
    type: String;
    required: true;
    validate: (t: unknown) => boolean;
    validationError: 'The provided Item type must be in the array of types defined by the game system';
  };
  img: FieldReturnType<typeof fields.IMAGE_FIELD, { default: () => string }>;
  data: FieldReturnType<typeof fields.OBJECT_FIELD, { default: (data: { type: string }) => any }>; // TODO
  effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect>;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: typeof fields.INTEGER_SORT_FIELD;
  permission: typeof fields.DOCUMENT_PERMISSIONS;
  flags: typeof fields.OBJECT_FIELD;
}

interface ItemDataProperties {
  /**
   * The _id which uniquely identifies this Item document
   */
  _id: string | null;

  /**
   * The name of this Item
   */
  name: string;

  /**
   * An Item subtype which configures the system data model applied
   */
  type: string;

  /**
   * An image file path which provides the artwork for this Item
   */
  img?: string | null;

  /**
   * The system data object which is defined by the system template.json model
   */
  data: object;

  /**
   * A collection of ActiveEffect embedded Documents
   */
  effects: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseActiveEffect>, ItemData>;

  /**
   * The _id of a Folder which contains this Item
   * @defaultValue `null`
   */
  folder: string | null;

  /**
   * The numeric sort value which orders this Item relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object which configures user permissions to this Item
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission: Partial<Record<string, ValueOf<typeof CONST.ENTITY_PERMISSIONS>>>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: Record<string, unknown>;
}

/**
 * The data schema for a Item document.
 * @see BaseItem
 */
export declare class ItemData extends DocumentData<ItemDataSchema, ItemDataProperties, documents.BaseItem> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface ItemData extends ItemDataProperties {}
