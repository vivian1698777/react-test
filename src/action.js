export const onItemAdd = AddObj => ({ type: 'ADD_ITEM', AddObj });
export const onItemDel = DelObj => ({ type: 'DEL_ITEM', DelObj });
export const onItemEdit = EditObj => ({ type: 'EDIT_ITEM', EditObj });
export const onItemSerNothing = () => ({ type: 'SEARCH_NOTHING' });
export const onItemSerResult = SerResultObj => ({ type: 'SEARCH_RESULT', SerResultObj })

export const onStateSorting = () => ({ type: 'SORT_STATE' });
export const onSortingAnchor = AnchorObj => ({ type: 'SORT_ANCHOR', AnchorObj });
export const onSortingBy = SortByObj => ({ type: 'SORT_BY', SortByObj });
export const onSortingName = SortNameObj => ({ type: 'SORT_NAME', SortNameObj });
export const onSortingDate = SortDateObj => ({ type: 'SORT_DATE', SortDateObj });    

export const onInputReset = () => ({ type: 'INPUT_RESET' });
export const onInputTarget = InputTargetObj => ({ type: 'INPUT_TARGET', InputTargetObj });
export const onErrorAddNoSpace = () => ({ type: 'ERROR_ADD_NO_SPACE' });
export const onErrorAddNoRepeat = () => ({ type: 'ERROR_ADD_NO_REPEAT' });
export const onErrorNormal = () => ({ type: 'ERROR_NORMAL' });
export const onErrorInputNoSpace = () => ({ type: 'ERROR_INPUT_NO_SPACE' });
export const onErrorInputNoRepeat = () => ({ type: 'ERROR_INPUT_NO_REPEAT' });

export const onInputEditing = InputEditingObj => ({ type: 'INPUT_EDITING', InputEditingObj });

export const onChecked = CheckedObj => ({ type: 'CHECKED', CheckedObj });