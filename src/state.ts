import { Subject, merge, EMPTY } from 'rxjs'
import {
  startWith,
  withLatestFrom,
  map,
  pluck,
  filter,
  switchMap,
  switchMapTo,
  catchError,
} from 'rxjs/operators'
import { bind, shareLatest, SUSPENSE } from '@react-rxjs/core'
import {
  Issue,
  getIssues,
  getRepoOpenIssuesCount,
  getIssue,
  getComments,
  getUserss,
  login
} from 'api/githubAPI'

export const INITIAL_ORG = 'rails'
export const INITIAL_REPO = 'rails'

const loginResultSubject$ = new Subject<string>()
export const onLogin = () => {
  loginResultSubject$.next()
}


const repoSubject$ = new Subject<{ org: string; repo: string }>()
export const onLoadRepo = (org: string, repo: string) => {
  repoSubject$.next({ org, repo })
}

const pageSelected$ = new Subject<number>()
export const onPageChange = (nextPage: number) => {
  pageSelected$.next(nextPage)
}

const issueSelected$ = new Subject<number | null>()
export const onIssueSelected = (id: number) => {
  issueSelected$.next(id)
}
export const onIssueUnselecteed = () => {
  issueSelected$.next(null)
}

const showUsers$ = new Subject<boolean>()
export const onShowUsers = () => {
  showUsers$.next(true)
}
export const onHideUsers = () => {
  showUsers$.next(false)
}


export const [useLoginResult, loginResult$] = bind(
  loginResultSubject$.pipe(
  )
)

export const [useCurrentRepo, currentRepo$] = bind(
  repoSubject$.pipe(
    startWith({
      org: INITIAL_ORG,
      repo: INITIAL_REPO,
    })
  )
)

export const currentRepoAndPage$ = merge(
  currentRepo$.pipe(
    map((currentRepo) => ({
      ...currentRepo,
      page: 1,
    }))
  ),
  pageSelected$.pipe(
    withLatestFrom(currentRepo$),
    map(([page, repo]) => ({ ...repo, page }))
  )
).pipe(shareLatest())

export const [useCurrentPage] = bind(currentRepoAndPage$.pipe(pluck('page')))

export const [useIssues, issues$] = bind(
  currentRepoAndPage$.pipe(
    switchMap(({ page, repo, org }) =>
      getIssues(org, repo, page).pipe(startWith(SUSPENSE))
    )
  )
)

export const [useUsers, users$] = bind(
  getUserss()
)

export const [useOpenIssuesLen, openIssuesLen$] = bind(
  currentRepo$.pipe(
    switchMap(({ org, repo }) =>
      getRepoOpenIssuesCount(org, repo).pipe(startWith(SUSPENSE))
    )
  )
)

currentRepoAndPage$
  .pipe(
    switchMapTo(merge(issues$, openIssuesLen$).pipe(catchError(() => EMPTY)))
  )
  .subscribe()

export const [useSelectedIssueId, selectedIssueId$] = bind(
  issueSelected$.pipe(startWith(null))
)

export const [useShowUsers, showUsersFlag$] = bind(
  showUsers$.pipe(startWith(false))
)

export const [useIssue, issue$] = bind(
  selectedIssueId$.pipe(
    filter((id): id is number => id !== null),
    withLatestFrom(currentRepo$),
    switchMap(([id, { org, repo }]) =>
      getIssue(org, repo, id).pipe(startWith(SUSPENSE))
    )
  )
)

export const [useIssueComments, issueComments$] = bind(
  issue$.pipe(
    filter((issue): issue is Issue => issue !== SUSPENSE),
    switchMap((issue) =>
      getComments(issue.comments_url).pipe(startWith(SUSPENSE))
    )
  )
)

selectedIssueId$
  .pipe(switchMapTo(issueComments$.pipe(catchError(() => EMPTY))))
  .subscribe()
