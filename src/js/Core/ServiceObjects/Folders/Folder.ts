import ServiceErrorHandling = require("../../../Enumerations/ServiceErrorHandling");
import FindItemsResults = require("../../../Search/FindItemsResults");
import PolicyTag = require("../../../ComplexProperties/PolicyTag");
import ArchiveTag = require("../../../ComplexProperties/ArchiveTag");
import ManagedFolderInformation = require("../../../ComplexProperties/ManagedFolderInformation");
import FolderPermissionCollection = require("../../../ComplexProperties/FolderPermissionCollection");
import SearchFilter = require("../../../Search/Filters/SearchFilter");
import GroupedFindItemsResults = require("../../../Search/GroupedFindItemsResults");
import ItemView = require("../../../Search/ItemView");
import Item = require("../Items/Item");
import ServiceResponseCollection = require("../../Responses/ServiceResponseCollection");
import FindItemResponse = require("../../Responses/FindItemResponse");
import Grouping = require("../../../Search/Grouping");
import AffectedTaskOccurrence = require("../../../Enumerations/AffectedTaskOccurrence");
import ViewBase = require("../../../Search/ViewBase");
import ExtendedPropertyDefinition = require("../../../PropertyDefinitions/ExtendedPropertyDefinition");
import PropertyDefinition = require("../../../PropertyDefinitions/PropertyDefinition");
import ServiceObjectSchema = require("../Schemas/ServiceObjectSchema");
import ServiceResponse = require("../../Responses/ServiceResponse");
import SendCancellationsMode = require("../../../Enumerations/SendCancellationsMode");
import ExchangeVersion = require("../../../Enumerations/ExchangeVersion");
import PropertySet = require("../../PropertySet");
import FindFoldersResults = require("../../../Search/FindFoldersResults");
import FolderView = require("../../../Search/FolderView");
import DeleteMode = require("../../../Enumerations/DeleteMode");
import ExchangeService = require("../../ExchangeService");
import WellKnownFolderName = require("../../../Enumerations/WellKnownFolderName");
import EffectiveRights = require("../../../Enumerations/EffectiveRights");
import ExtendedPropertyCollection = require("../../../ComplexProperties/ExtendedPropertyCollection");
import FolderId = require("../../../ComplexProperties/FolderId");
import FolderSchema = require("../Schemas/FolderSchema");
import {EwsLogging} from "../../EwsLogging";
import {IPromise} from "../../../Interfaces";
import {Promise} from "../../../PromiseFactory"
import XmlElementNames = require("../../XmlElementNames");

import ServiceObject = require("../ServiceObject");
class Folder extends ServiceObject {
    get Id(): FolderId { return <FolderId>this.PropertyBag._getItem(this.GetIdPropertyDefinition()); }
    get ParentFolderId(): FolderId { return <FolderId>this.PropertyBag._getItem(FolderSchema.ParentFolderId); }
    get ChildFolderCount(): number { return <number>this.PropertyBag._getItem(FolderSchema.ChildFolderCount); }
    get DisplayName(): string { return <string>this.PropertyBag._getItem(FolderSchema.DisplayName); }
    set DisplayName(value: string) { this.PropertyBag._setItem(FolderSchema.DisplayName, value); }
    get FolderClass(): string { return <string>this.PropertyBag._getItem(FolderSchema.FolderClass); }
    set FolderClass(value: string) { this.PropertyBag._setItem(FolderSchema.FolderClass, value); }
    get TotalCount(): number { return <number>this.PropertyBag._getItem(FolderSchema.TotalCount); }
    get ExtendedProperties(): ExtendedPropertyCollection { return <ExtendedPropertyCollection>this.PropertyBag._getItem(FolderSchema.ExtendedProperties); }
    get ManagedFolderInformation(): ManagedFolderInformation { return <ManagedFolderInformation>this.PropertyBag._getItem(FolderSchema.ManagedFolderInformation); }
    get EffectiveRights(): EffectiveRights { return <EffectiveRights>this.PropertyBag._getItem(FolderSchema.EffectiveRights); }
    get Permissions(): FolderPermissionCollection { return <FolderPermissionCollection>this.PropertyBag._getItem(FolderSchema.Permissions); }
    get UnreadCount(): number { return <number>this.PropertyBag._getItem(FolderSchema.UnreadCount); }
    get PolicyTag(): PolicyTag { return <PolicyTag>this.PropertyBag._getItem(FolderSchema.PolicyTag); }
    set PolicyTag(value: PolicyTag) { this.PropertyBag._setItem(FolderSchema.PolicyTag, value); }
    get ArchiveTag(): ArchiveTag { return <ArchiveTag>this.PropertyBag._getItem(FolderSchema.ArchiveTag); }
    set ArchiveTag(value) { this.PropertyBag._setItem(FolderSchema.ArchiveTag, value); }
    get WellKnownFolderName(): WellKnownFolderName { return <WellKnownFolderName>this.PropertyBag._getItem(FolderSchema.WellKnownFolderName); }
    
    /**
     * _FolderTYpe -> type of folder, use to avoid folder type detection using instanceof. some cases it has circular loop in nodejs/requirejs
     */
    get _FolderType(): string { return XmlElementNames.Folder; }



    constructor(service: ExchangeService) {
        super(service);
    }

    static Bind(service: ExchangeService, id: FolderId): IPromise<Folder>;
    static Bind(service: ExchangeService, name: WellKnownFolderName): IPromise<Folder>;
    static Bind(service: ExchangeService, id: FolderId, propertySet: PropertySet): IPromise<Folder>;
    static Bind(service: ExchangeService, name: WellKnownFolderName, propertySet: PropertySet): IPromise<Folder>;
    static Bind(service: ExchangeService, idOrName: FolderId | WellKnownFolderName, propertySet: PropertySet = PropertySet.FirstClassProperties): IPromise<Folder> {
        if (idOrName instanceof FolderId) {
            return service.BindToFolder(idOrName, propertySet);
        }
        else if (typeof idOrName === 'number') {
            return service.BindToFolder(new FolderId(idOrName), propertySet);
        }
        EwsLogging.Assert(false, "Folder.Bind", "unknown paramete type");
        throw new Error("unknow parameter type. this should not be  reached");
    }

    Copy(destinationFolderName: WellKnownFolderName): IPromise<Folder>;
    Copy(destinationFolderId: FolderId): IPromise<Folder>;
    Copy(destinationFolderIdOrName: FolderId | WellKnownFolderName): IPromise<Folder> {
        this.ThrowIfThisIsNew();
        //EwsUtilities.ValidateParam(destinationFolderId, "destinationFolderId");

        if (typeof destinationFolderIdOrName === 'undefined') {
            EwsLogging.Assert(false, "Folder.Copy", "unknown paramete type");
            throw new Error("unknow parameter type. this should not be  reached");
        }
        var folderId: FolderId = <FolderId>destinationFolderIdOrName;
        if (typeof destinationFolderIdOrName === 'number')
            folderId = new FolderId(destinationFolderIdOrName);

        return this.Service.CopyFolder(this.Id, folderId);
    }
    
    Delete(deleteMode: DeleteMode): IPromise<void> { return this.InternalDelete(deleteMode, null, null); }
    Empty(deleteMode: DeleteMode, deleteSubFolders: boolean): IPromise<void> {
        this.ThrowIfThisIsNew();
        return this.Service.EmptyFolder(
            this.Id,
            deleteMode,
            deleteSubFolders);
    }
    FindFolders(view: FolderView): IPromise<FindFoldersResults>;
    FindFolders(searchFilter: SearchFilter, view: FolderView): IPromise<FindFoldersResults>;
    FindFolders(viewOrSearchFilter: FolderView | SearchFilter, view?: FolderView): IPromise<FindFoldersResults> {
        this.ThrowIfThisIsNew();
        //todo: better argument check with ewsutilities
        var argsLength = arguments.length;
        if (argsLength < 1 && argsLength > 2) {
            throw new Error("invalid arguments, check documentation and try again.");
        }

        if (viewOrSearchFilter instanceof FolderView) {
            return this.Service.FindFolders(this.Id, view);
        }
        else if (viewOrSearchFilter instanceof SearchFilter) {
            if (typeof view === 'undefined' || !(view instanceof FolderView)) {
                throw new Error("Folder.ts - FindFolders - incorrect uses of parameters at 2nd position, must be FolderView");
            }
            return this.Service.FindFolders(this.Id, viewOrSearchFilter, view);
        }
        else {
            throw new Error("Folder.ts - FindFolders - incorrect uses of parameters at 1st position, must be FolderView or SearchFilter");
        }
    }

    FindItems(view: ItemView): IPromise<FindItemsResults<Item>>;
    FindItems(view: ItemView, groupBy: Grouping): IPromise<GroupedFindItemsResults<Item>>;
    FindItems(queryString: string, view: ItemView): IPromise<FindItemsResults<Item>>;
    FindItems(searchFilter: SearchFilter, view: ItemView): IPromise<FindItemsResults<Item>>;
    FindItems(queryString: string, view: ItemView, groupBy: Grouping): IPromise<GroupedFindItemsResults<Item>>;
    FindItems(searchFilter: SearchFilter, view: ItemView, groupBy: Grouping): IPromise<GroupedFindItemsResults<Item>>;

    FindItems(
        viewQueryStringOrSearchFilter: string| ItemView | SearchFilter,
        viewOrGroupBy?: ItemView| Grouping,
        groupBy?: Grouping
        ): IPromise<FindItemsResults<Item> | GroupedFindItemsResults<Item>> {

        var argsLength = arguments.length;
        if (argsLength < 1 && argsLength > 3) {
            throw new Error("invalid arguments, check documentation and try again.");
        }
        
        //todo: better argument check with ewsutilities
        //EwsUtilities.ValidateParam(groupBy, "groupBy");
        //EwsUtilities.ValidateParamAllowNull(searchFilter, "searchFilter");
        //EwsUtilities.ValidateParamAllowNull(queryString, "queryString");

        //position 1 - viewQueryStringOrSearchFilter
        var queryString: string = null;
        var searchFilter: SearchFilter = null;
        var view: ItemView = null;

        if (typeof viewQueryStringOrSearchFilter === 'string') {
            queryString = viewQueryStringOrSearchFilter;
        }
        else if (viewQueryStringOrSearchFilter instanceof SearchFilter) {
            searchFilter = viewQueryStringOrSearchFilter;
        }
        else if (viewQueryStringOrSearchFilter instanceof ViewBase) {
            view = viewQueryStringOrSearchFilter;
        }
        else {
            throw new Error("Folder.ts - FindItems - incorrect uses of parameters at 1st position, must be string, Itemview or SearchFilter");
        }

        var groupResultBy: Grouping = null;
        var isGroupped: boolean = false; // to resturn GroupedFindItemsResults<Item>
        
        //position 2 - viewOrGroupBy
        if (argsLength >= 3) {
            if (viewOrGroupBy instanceof Grouping) {
                if (!(viewQueryStringOrSearchFilter instanceof ItemView)) {
                    throw new Error("Folder.ts - FindItems with " + argsLength + " parameters - incorrect uses of parameter at 1nd position, it must be Itemview when using Grouping at 2nd place");
                }
                groupResultBy = viewOrGroupBy;
                isGroupped = true;
            }
            else if (viewOrGroupBy instanceof ItemView) {
                view = viewOrGroupBy;
            }
            else {
                throw new Error("ExchangeService.ts - FindItems with " + argsLength + " parameters - incorrect uses of parameter at 2nd position, must be Itemsview or Grouping");
            }
        }
        
        //position 3 - groupBy
        if (argsLength === 3) {
            if (!(viewOrGroupBy instanceof ItemView)) {
                throw new Error("Folder.ts - FindItems with " + argsLength + " parameters - incorrect uses of parameter at 1nd position, it must be Itemview when using Grouping at 3rd place");
            }
            groupResultBy = <Grouping>groupBy;
            isGroupped = true;
        }

        return this.InternalFindItems<Item>(
            searchFilter || queryString,
            view,
            groupResultBy /* groupBy */)
            .then((res) => {
                if (isGroupped) {
                    return res.__thisIndexer(0).GroupedFindResults;
                }
                return res.__thisIndexer(0).Results;
            });
    }

    GetXmlElementName(): string { return XmlElementNames.Folder; }
    GetChangeXmlElementName(): string { return XmlElementNames.FolderChange; }
    GetDeleteFieldXmlElementName(): string { return XmlElementNames.DeleteFolderField; }
    GetExtendedProperties(): ExtendedPropertyCollection { return this.ExtendedProperties; }
    GetIdPropertyDefinition(): PropertyDefinition { return FolderSchema.Id; }
    GetMinimumRequiredServerVersion(): ExchangeVersion { return ExchangeVersion.Exchange2007_SP1; }
    GetSchema(): ServiceObjectSchema { return FolderSchema.Instance; }
    GetSetFieldXmlElementName(): string { return XmlElementNames.SetFolderField; }
    InternalDelete(deleteMode: DeleteMode, sendCancellationsMode?: SendCancellationsMode, affectedTaskOccurrences?: AffectedTaskOccurrence): IPromise<void> {
        this.ThrowIfThisIsNew();
        return this.Service.DeleteFolder(this.Id, deleteMode);
    }
    protected InternalFindItems<TItem extends Item>(queryString: string, view: ViewBase, groupBy: Grouping): IPromise<ServiceResponseCollection<FindItemResponse<TItem>>>;
    protected InternalFindItems<TItem extends Item>(searchFilter: SearchFilter, view: ViewBase, groupBy: Grouping): IPromise<ServiceResponseCollection<FindItemResponse<TItem>>>;
    /**this is to shim find items with querystring or searchfilter. */
    protected InternalFindItems<TItem extends Item>(searchFilterOrQueryString: SearchFilter | string, view: ViewBase, groupBy: Grouping): IPromise<ServiceResponseCollection<FindItemResponse<TItem>>>;
    protected InternalFindItems<TItem extends Item>(searchFilterOrQueryString: SearchFilter | string, view: ViewBase, groupBy: Grouping): IPromise<ServiceResponseCollection<FindItemResponse<TItem>>> {
        this.ThrowIfThisIsNew();
        var searchFilter: SearchFilter = null;
        var queryString = null;
        if (searchFilterOrQueryString instanceof SearchFilter) {
            searchFilter = searchFilterOrQueryString;
        }
        else if (typeof searchFilterOrQueryString === 'string') {
            queryString = searchFilterOrQueryString;
        }
        debugger;//check: verify if querystring is null
        return this.Service.FindItems<TItem>(
            [this.Id], // FolderId[]
            searchFilter, /* searchFilter */
            queryString, /* queryString */
            view,
            groupBy,
            ServiceErrorHandling.ThrowOnError);
    }

    InternalLoad(propertySet: PropertySet): IPromise<void> {
        this.ThrowIfThisIsNew();
        return this.Service.LoadPropertiesForFolder(this, propertySet);
    }
    MarkAllItemsAsRead(suppressReadReceipts: boolean): IPromise<void> {
        this.ThrowIfThisIsNew();
        return this.Service.MarkAllItemsAsRead(
            this.Id,
            true,
            suppressReadReceipts);
    }
    MarkAllItemsAsUnread(suppressReadReceipts: boolean): IPromise<void> {
        this.ThrowIfThisIsNew();
        return this.Service.MarkAllItemsAsRead(
            this.Id,
            false,
            suppressReadReceipts);
    }
    Move(destinationFolderName: WellKnownFolderName): IPromise<Folder>;
    Move(destinationFolderId: FolderId): IPromise<Folder>;
    Move(destinationFolderIdOrName: FolderId | WellKnownFolderName): IPromise<Folder> {
        this.ThrowIfThisIsNew();
        if (typeof destinationFolderIdOrName === 'undefined') {
            EwsLogging.Assert(false, "Folder.Move", "unknown paramete type");
            throw new Error("unknow parameter type. this should not be  reached");
        }
        //EwsUtilities.ValidateParam(destinationFolderId, "destinationFolderId");
        
        var folderId: FolderId = <FolderId>destinationFolderIdOrName;
        if (typeof destinationFolderIdOrName === 'number')
            folderId = new FolderId(destinationFolderIdOrName);

        return this.Service.MoveFolder(this.Id, folderId);
    }
    RemoveExtendedProperty(extendedPropertyDefinition: ExtendedPropertyDefinition): boolean { return this.ExtendedProperties.RemoveExtendedProperty(extendedPropertyDefinition); }

    Save(parentFolderName: WellKnownFolderName): IPromise<void>;
    Save(parentFolderId: FolderId): IPromise<void>;
    Save(parentFolderIdOrname: FolderId | WellKnownFolderName): IPromise<void> {
        this.ThrowIfThisIsNotNew();
        if (typeof parentFolderIdOrname === 'undefined') {
            EwsLogging.Assert(false, "Folder.Save", "unknown paramete type");
            throw new Error("unknow parameter type. this should not be  reached");
        }
        //EwsUtilities.ValidateParam(parentFolderId, "parentFolderId");
        var folderId: FolderId = <FolderId>parentFolderIdOrname;
        if (typeof parentFolderIdOrname === 'number')
            folderId = new FolderId(parentFolderIdOrname);

        if (this.IsDirty) {
            return this.Service.CreateFolder(this, folderId);
        }
        else return null;



    }
    SetExtendedProperty(extendedPropertyDefinition: ExtendedPropertyDefinition, value: any): void { this.ExtendedProperties.SetExtendedProperty(extendedPropertyDefinition, value); }
    Update(): IPromise<void> {
        if (this.IsDirty) {
            if (this.PropertyBag.GetIsUpdateCallNecessary()) {
                return this.Service.UpdateFolder(this);
            }
        }
        return undefined;
    }
    Validate(): void {
        super.Validate();

        // Validate folder permissions
        if (this.PropertyBag.Contains(FolderSchema.Permissions)) {
            this.Permissions.Validate();
        }
    }

    //created this to keep item and folder object away frmo here. modularization would fail and create a larger file
    IsFolderInstance(): boolean { return true; }//only folder instance returns true.
}

export = Folder;




//module Microsoft.Exchange.WebServices.Data {
//}
//import _export = Microsoft.Exchange.WebServices.Data;
//export = _export
