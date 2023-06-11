// FOUNDRY_VERSION: 10.291

import Document, { DocumentMetadata } from "../abstract/document.mjs";
import * as CONST from "../constants.mjs";
import * as fields from "../data/fields.mjs";
import { TextureData } from "../data/data.mjs";

declare global {
  type TileData = BaseTile.Properties;

  type TileOcclusionData = BaseTile.Properties["occlusion"];

  type TileVideoData = BaseTile.Properties["video"];
}

/**
 * The Document definition for a Tile.
 * Defines the DataSchema and common behaviors for a Tile which are shared between both client and server.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BaseTile extends BaseTile.Properties {}
declare class BaseTile extends Document<BaseTile.SchemaField, BaseTile.Metadata> {
  /**
   * @param data    - Initial data from which to construct the Tile
   * @param context - Construction context options
   */
  constructor(data: BaseTile.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseTile.Metadata>;

  static override defineSchema(): BaseTile.Schema;

  static override migrateData(source: object): object;

  static override shimData(
    data: object,
    {
      embedded
    }?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    }
  ): object;
}
export default BaseTile;

declare namespace BaseTile {
  type Metadata = Merge<
    DocumentMetadata,
    { name: "Tile"; collection: "tiles"; label: "DOCUMENT.Tile"; labelPlural: "DOCUMENT.Tiles" }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = UpdateData;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Tile embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * An image or video texture which this tile displays.
     * @defaultValue `null`
     */
    texture: TextureData<{}, { categories: ["IMAGE", "VIDEO"]; initial: null; wildcard: false }>;

    /**
     * The pixel width of the tile
     * @defaultValue `0`
     */
    width: fields.NumberField<{
      required: true;
      min: 0;
      nullable: false;
      step: 0.1;
    }>;

    /**
     * The pixel height of the tile
     * @defaultValue `0`
     */
    height: fields.NumberField<{ required: true; min: 0; nullable: false; step: 0.1 }>;

    /**
     * The x-coordinate position of the top-left corner of the tile
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

    /**
     * The y-coordinate position of the top-left corner of the tile
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

    /**
     * The z-index ordering of this tile relative to its siblings
     * @defaultValue `100`
     */
    z: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 100 }>;

    /**
     * The angle of rotation for the tile between 0 and 360
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * The tile opacity
     * @defaultValue `1`
     */
    alpha: fields.AlphaField;

    /**
     * Is the tile currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField;

    /**
     * Is the tile currently locked?
     * @defaultValue `false`
     */
    locked: fields.BooleanField;

    /**
     * Is the tile an overhead tile?
     * @defaultValue `false`
     */
    overhead: fields.BooleanField;

    /**
     * Is the tile a roof?
     * @defaultValue `false`
     */
    roof: fields.BooleanField;

    /**
     * The tile's occlusion settings
     * @defaultValue `{ mode: CONST.TILE_OCCLUSION_MODES.FADE, alpha: 0, radius: null }`
     */
    occlusion: fields.SchemaField<{
      /**
       * The occlusion mode from CONST.TILE_OCCLUSION_MODES
       * @defaultValue `1`
       */
      mode: fields.NumberField<{
        choices: CONST.TILE_OCCLUSION_MODES[];
        initial: typeof CONST.TILE_OCCLUSION_MODES.FADE;
        validationError: "must be a value in CONST.TILE_OCCLUSION_MODES";
      }>;

      /**
       * The occlusion alpha between 0 and 1
       * @defaultValue `0`
       */
      alpha: fields.AlphaField<{ initial: 0 }>;

      /**
       * An optional radius of occlusion used for RADIAL mode
       * @defaultValue `null`
       */
      radius: fields.NumberField<{ positive: true }>;
    }>;

    /**
     * The tile's video settings
     * @defaultValue `null`
     */
    video: fields.SchemaField<{
      /**
       * Automatically loop the video?
       * @defaultValue `true`
       */
      loop: fields.BooleanField<{ initial: true }>;

      /**
       * Should the video play automatically?
       * @defaultValue `true`
       */
      autoplay: fields.BooleanField<{ initial: true }>;

      /**
       * The volume level of any audio that the video file contains
       * @defaultValue `0`
       */
      volume: fields.AlphaField<{ initial: 0; step: 0.01 }>;
    }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `null`
     */
    flags: fields.ObjectField.FlagsField<"Tile">;
  }
}
