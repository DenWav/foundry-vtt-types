import { ConfiguredDocumentClass, ConfiguredSheetClass, ToObjectFalseType } from '../../../../../types/helperTypes';
import { DropData as ClientDocumentMixinDropData } from '../../../clientDocumentMixin';

declare global {
  /**
   * The Application responsible for displaying and editing a single Actor document.
   * This Application is responsible for rendering an actor's attributes and allowing the actor to be edited.
   * @param actor   - The Actor instance being displayed within the sheet.
   * @param options - Additional application configuration options.
   *
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class ActorSheet<
    Options extends ActorSheet.Options = ActorSheet.Options,
    Data extends object = ActorSheet.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClass<typeof Actor>>> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   height: 720,
     *   width: 800,
     *   template: 'templates/sheets/actor-sheet.html',
     *   closeOnSubmit: false,
     *   submitOnClose: true,
     *   submitOnChange: true,
     *   resizable: true,
     *   baseApplication: 'ActorSheet',
     *   dragDrop: [{ dragSelector: '.item-list .item', dropSelector: null }],
     *   token: null,
     * });
     * ```
     */
    static get defaultOptions(): ActorSheet.Options;

    /** @override */
    get id(): string;

    /** @override */
    get title(): string;

    /**
     * A convenience reference to the Actor entity
     */
    get actor(): this['object'];

    /**
     * If this Actor Sheet represents a synthetic Token actor, reference the active Token
     */
    get token(): Required<this['object']['token']> | Required<this['options']['token']> | null;

    /** @override */
    close(options?: FormApplication.CloseOptions): Promise<void>;

    /**
     * @override
     */
    getData(options?: Application.RenderOptions): Data | Promise<Data>;

    /** @override */
    protected _getHeaderButtons(): Application.HeaderButton[];

    /** @override */
    protected _getSubmitData(updateData?: object | null): Partial<Record<string, unknown>>;

    /** @override */
    activateListeners(html: JQuery): void;

    /**
     * Handle requests to configure the Token for the Actor
     */
    protected _onConfigureToken(event: JQuery.ClickEvent): void;

    /**
     * Handle requests to configure the default sheet used by this Actor
     */
    protected _onConfigureSheet(event: JQuery.ClickEvent): void;

    /**
     * Handle changing the actor profile image by opening a FilePicker
     */
    protected _onEditImage(event: JQuery.ClickEvent): ReturnType<FilePicker['browse']>;

    /** @override */
    protected _canDragStart(selector: string): boolean;

    /** @override */
    protected _canDragDrop(selector: string): boolean;

    /** @override */
    protected _onDragStart(event: DragEvent): void;

    /** @override */
    protected _onDrop(event: DragEvent): Promise<boolean | undefined> | unknown;

    /**
     * Handle the dropping of ActiveEffect data onto an Actor Sheet
     * @param event - The concluding DragEvent which contains drop data
     * @param data  - The data transfer extracted from the event
     * @returns A data object which describes the result of the drop
     * @remarks This is intentionally typed to return `Promise<unknown>` to
     * allow overriding methods to return whatever they want. The return type is
     * not meant to be used aside from being awaited.
     */
    protected _onDropActiveEffect(event: DragEvent, data: ActorSheet.DropData.ActiveEffect): Promise<unknown>;

    /**
     * Handle dropping of an item reference or item data onto an Actor Sheet
     * @param event - The concluding DragEvent which contains drop data
     * @param data  - The data transfer extracted from the event
     * @returns A data object which describes the result of the drop
     * @remarks This is intentionally typed to return `Promise<unknown>` to
     * allow overriding methods to return whatever they want. The return type is
     * not meant to be used aside from being awaited.
     */
    protected _onDropActor(event: DragEvent, data: ActorSheet.DropData.Actor): Promise<unknown>;

    /**
     * Handle dropping of an item reference or item data onto an Actor Sheet
     * @param event - The concluding DragEvent which contains drop data
     * @param data  - The data transfer extracted from the event
     * @remarks This is intentionally typed to return `Promise<unknown>` to
     * allow overriding methods to return whatever they want. The return type is
     * not meant to be used aside from being awaited.
     */
    protected _onDropItem(event: DragEvent, data: ActorSheet.DropData.Item): Promise<unknown>;

    /**
     * Handle dropping of a Folder on an Actor Sheet.
     * Currently supports dropping a Folder of Items to create all items as owned items.
     * @param event - The concluding DragEvent which contains drop data
     * @param data  - The data transfer extracted from the event
     * @remarks This is intentionally typed to return `Promise<unknown>` to
     * allow overriding methods to return whatever they want. The return type is
     * not meant to be used aside from being awaited.
     */
    protected _onDropFolder(event: DragEvent, data: ActorSheet.DropData.Folder): Promise<unknown>;

    /**
     * Handle the final creation of dropped Item data on the Actor.
     * This method is factored out to allow downstream classes the opportunity to override item creation behavior.
     * @param itemData - The item data requested for creation
     */
    protected _onDropItemCreate(
      itemData: foundry.data.ItemData['_source'][] | foundry.data.ItemData['_source']
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Item>>[]>;

    /**
     * Handle a drop event for an existing Owned Item to sort that item
     */
    protected _onSortItem(
      event: DragEvent,
      itemData: foundry.data.ItemData['_source']
    ): undefined | Promise<InstanceType<ConfiguredDocumentClass<typeof Item>>[]>;
  }

  namespace ActorSheet {
    /**
     * @typeParam Options - the type of the options object
     */
    interface Data<Options extends ActorSheet.Options = ActorSheet.Options>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClass<typeof Actor>>, Options> {
      actor: this['object'];
      items: ToObjectFalseType<foundry.data.ActorData>['items'];
      effects: ToObjectFalseType<foundry.data.ActorData>['effects'];
    }

    type DropData =
      | DropData.ActiveEffect
      | DropData.Actor
      | DropData.Item
      | DropData.Folder
      | (Partial<Record<string, unknown>> & { type: string });

    namespace DropData {
      interface ActiveEffect {
        type: 'ActiveEffect';
        tokenId?: string;
        actorId?: string;
        data: foundry.data.ActiveEffectData['_source'];
      }

      interface Actor {
        type: 'Actor';
      }

      type Item = ClientDocumentMixinDropData<InstanceType<ConfiguredDocumentClass<typeof Item>>> & {
        type: 'Item';
      };

      interface Folder {
        type: 'Folder';
        documentName: foundry.CONST.FolderEntityTypes;
        id: string;
      }
    }

    interface Options extends DocumentSheet.Options {
      token?: InstanceType<ConfiguredSheetClass<typeof foundry.documents.BaseToken>> | null;
    }
  }
}
