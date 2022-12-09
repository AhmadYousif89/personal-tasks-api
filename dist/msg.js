"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const react_i18next_1 = require("react-i18next");
const ui_react_1 = require("@ctct/ui-react");
const common_1 = require("@ctct-segments-lerna/common");
require("./_actions.scss");
const MAX_LISTS = 1000;
const SelectLists = ({ t, fieldLabel, fieldDescription, canAdd, isRequired, isReadOnly, isSection, selectedListIds, handlerFunc, autoFocusInput, trackingDetails, }) => {
    const [lists, setLists] = (0, react_1.useState)([]);
    const [inputValue, setInputValue] = (0, react_1.useState)('');
    const [selectedItems, setSelectedItems] = (0, react_1.useState)([]);
    const [suggestedItems, setSuggestedItems] = (0, react_1.useState)([]);
    const [menuItems, setMenuItems] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)('loading');
    const [creating, setCreating] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [emptyText, setEmptyText] = (0, react_1.useState)('');
    const track = (action) => {
        common_1.TrackingHelper.track({
            action,
            info: { _sctLinkLocation: trackingDetails.linkLocation },
        });
    };
    const tagBoxRef = (0, react_1.useRef)();
    const selectedLists = lists.filter((list) => selectedListIds.includes(list.value));
    const handleInput = (e) => {
        setInputValue(e.target.value);
        setSuggestedItems((0, common_1.getMenuItemsFromQuery)(lists, e.target.value, selectedItems));
    };
    const handleFocusInput = (e) => {
        setSuggestedItems((0, common_1.getMenuItemsFromQuery)(lists, e.target.value, selectedItems));
    };
    const handleChoose = (e, item) => {
        setError(null);
        const createListHandler = async (listName) => {
            setCreating(true);
            try {
                const createdList = await common_1.listsService.createList(listName, null, false, false);
                const { newSelectedItems, updatedItems } = (0, common_1.updateWithNewItem)(lists, selectedItems, createdList.name, createdList.list_id);
                setLists(updatedItems);
                setSelectedItems(newSelectedItems);
                setSuggestedItems((0, common_1.getMenuItemsFromQuery)(lists, '', newSelectedItems));
                track('create-new-list');
            }
            catch (err) {
                setError(err);
            }
            finally {
                setCreating(false);
            }
        };
        const createNewTextLength = t('profile.actions.select_lists.createNew', {
            inputValue: '',
        });
        if (item.value === 'create') {
            createListHandler(item.text.substring(0, item.text.length - createNewTextLength.length));
        }
        else {
            track('select-existing-list');
            const newSelectedItems = [
                ...selectedItems,
                {
                    text: item.text,
                    value: item.value,
                    key: item.key,
                    glyph: item.glyph,
                },
            ];
            setSelectedItems(newSelectedItems);
            setSuggestedItems((0, common_1.getMenuItemsFromQuery)(lists, '', newSelectedItems));
        }
        setInputValue('');
    };
    const handleRemoveList = (e, data) => {
        track('remove-selected-list');
        setSelectedItems(selectedItems.filter((item) => {
            return item.value !== data.item.value;
        }));
    };
    const handleClearLists = () => {
        track('clear-all-selected-lists');
        setSelectedItems([]);
    };
    const isInvalid = () => {
        return selectedItems.length === 0 && isRequired;
    };
    const handleListsGet = (collection) => {
        const listsArray = collection.lists;
        const selectedListsArray = [];
        setLists(listsArray.map((l) => {
            const item = {
                text: l.name,
                value: l.list_id,
                key: l.list_id,
                glyph: l.favorite ? 'starFilled' : undefined,
            };
            if (selectedListIds.includes(l.list_id)) {
                selectedListsArray.push(item);
            }
            return item;
        }));
        setSelectedItems(selectedListsArray);
        setLoading(false);
    };
    (0, react_1.useEffect)(() => {
        setSuggestedItems((0, common_1.getMenuItemsFromQuery)(lists, inputValue, selectedItems));
    }, [loading]);
    (0, react_1.useEffect)(() => {
        const { retVal, emptyLabel } = (0, common_1.makeMenu)(t, loading, lists, suggestedItems, inputValue, selectedItems, canAdd, 'lists', MAX_LISTS, trackingDetails);
        setEmptyText(emptyLabel);
        setMenuItems(retVal);
    }, [suggestedItems]);
    (0, react_1.useEffect)(() => {
        handlerFunc(selectedItems, error, creating);
    }, [selectedItems, error, creating]);
    (0, react_1.useEffect)(() => {
        const listsFetch = async () => {
            try {
                await common_1.listsService.getLists(handleListsGet, false);
            }
            catch (err) {
                setLoading('error');
            }
        };
        listsFetch();
        if (tagBoxRef.current &&
            tagBoxRef.current.getElementsByTagName('input')[0] &&
            autoFocusInput) {
            tagBoxRef.current.getElementsByTagName('input')[0].focus();
            setTimeout(() => {
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                if (tagBoxRef.current) {
                    tagBoxRef.current
                        .getElementsByTagName('input')[0]
                        .dispatchEvent(event);
                }
            }, 500);
        }
        return () => {
            setLoading('loading');
            setCreating(false);
            setError(null);
            setInputValue('');
            setSelectedItems([]);
            setSuggestedItems([]);
            setMenuItems([]);
        };
    }, [canAdd]);
    return loading = { creating };
    loader = {} < ui_react_1.LoadingIndicator;
    text = {} /  > ;
};
data - qe - id;
"create-list-action-loading"
    >
        { isSection } && heading;
{
    fieldLabel;
}
/>}
    < ui_react_1.Field;
label = { isSection, '': fieldLabel };
description = { fieldDescription };
data - qe - id;
"select-lists-tagbox-field";
error = {};
{
    errors: [t('profile.actions.select_lists.requiredText')],
        id;
    'select-lists-tagbox-error',
    ;
}
undefined;
    >
        {} - qe - id;
"profile-edit-lists-read-only";
style = {};
{
    maxHeight: '190px',
        overflowY;
    'auto',
        padding;
    '1rem',
    ;
}
tabIndex = "0"
    >
        className;
"selected-lists js-lists-view";
data - qe - id;
"profile-edit-selected-lists-read-only"
    >
        { selectedLists } &&
    selectedLists.map((list, index) => {
        return key = { list, : .key } >
            { list, : .favorite ? glyph = "starFilled"
                    :
                ,
                title = "favorite",
                key = { list, : .value },
                size = "large",
                text = { list, : .text },
                data } - qe - id;
        {
            `profile-view-selected-list-${index}`;
        }
        className = "details-tag-custom"
            /  >
        ;
    });
key = { list, : .value };
size = "large";
text = { list, : .text };
data - qe - id;
{
    `profile-view-selected-list-${index}`;
}
className = "details-tag-custom"
    /  >
;
/div>;
;
/div>
    < /Well>;
inputName = "lists";
searchPlaceholder = {};
tags = { selectedItems };
items = { menuItems };
inputValue = { inputValue };
inputInvalid = {};
menuMaxHeight = { 200:  };
onInputInput = { handleInput };
onFocusInput = { handleFocusInput };
onChooseMenuItem = { handleChoose };
onRemoveTag = { handleRemoveList };
onClearTags = { handleClearLists };
emptyText = { emptyText };
data - qe - id;
"select-lists-tagbox";
innerRef = { tagBoxRef }
    /  >
;
/Field>
    < /Loadable>
    < />;
;
;
SelectLists.defaultProps = {
    canAdd: true,
    isRequired: false,
    selectedListIds: [],
    isReadOnly: false,
    isSection: false,
    autoFocusInput: false,
    trackingDetails: {
        linkLocation: 'tagbox-lists-select',
    },
};
SelectLists.propTypes = {
    t: prop_types_1.default.func.isRequired,
    fieldLabel: prop_types_1.default.string.isRequired,
    fieldDescription: prop_types_1.default.string.isRequired,
    canAdd: prop_types_1.default.bool,
    isRequired: prop_types_1.default.bool,
    isReadOnly: prop_types_1.default.bool,
    isSection: prop_types_1.default.bool,
    selectedListIds: prop_types_1.default.arrayOf(prop_types_1.default.string),
    handlerFunc: prop_types_1.default.func.isRequired,
    autoFocusInput: prop_types_1.default.bool,
    trackingDetails: prop_types_1.default.shape({
        linkLocation: prop_types_1.default.string,
    }),
};
exports.default = (0, react_i18next_1.withTranslation)()(SelectLists);
//# sourceMappingURL=msg.js.map