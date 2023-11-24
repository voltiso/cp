// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

// export interface DiffResult {
// 	same: boolean

// 	diffs: Diff[]

// 	readAllWant: boolean
// 	readAllHave: boolean
// }

export type Diff =
	| WrongChar
	| MissingChar
	| ExtraChar
	| WrongToken
	| MissingToken
	| ExtraToken

//

export interface LineLevelDiff {
	lineIdx: number
}

export interface TokenLevelDiff extends LineLevelDiff {
	// tokenIdx: number
	lineTokenIdx: number
}

export interface CharLevelDiff extends TokenLevelDiff {
	// charIdx: number
	tokenCharIdx: number
	// lineCharIdx: number
}

//

export interface WrongChar extends CharLevelDiff {
	type: 'wrong-char'

	wantCharCode: number
	haveCharCode: number
}

export interface MissingChar extends CharLevelDiff {
	type: 'missing-char'

	wantCharCode: number
}

export interface ExtraChar extends CharLevelDiff {
	type: 'extra-char'

	haveCharCode: number
}

//

/** For short tokens */
export interface WrongToken extends TokenLevelDiff {
	type: 'wrong-token'

	want: string
	have: string
}

/** For short tokens */
export interface MissingToken extends TokenLevelDiff {
	type: 'missing-token'

	want: string
}

/** For short tokens */
export interface ExtraToken extends TokenLevelDiff {
	type: 'extra-token'

	want: string
}
