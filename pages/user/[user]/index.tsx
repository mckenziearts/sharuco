"use client"

import Head from "next/head"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogin } from "@/firebase/auth/githubLogin"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useGetFavoriteCode } from "@/firebase/firestore/getFavoriteCode"
import { useGetIsPrivateCodeFromUser } from "@/firebase/firestore/getIsPrivateCodeFromUser"
import { useUpdateUserDocument } from "@/firebase/firestore/updateUserDocument"
import { Eye, Github, Loader2, Star, UserIcon, Verified } from "lucide-react"
import moment from "moment"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { cn } from "@/lib/utils"
import CardCode from "@/components/card-code"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import LoaderCodes from "@/components/loader-codes"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function User() {
  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName

  const searchParams = useSearchParams()
  const idCurrent = searchParams.get("user").toLowerCase()

  const { login, isPending } = useGitHubLogin()

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(pseudo, "users")

  const { data, isLoading, isError } = useDocument(idCurrent, "users")

  const {
    isLoading: isLoadingPublicCodes,
    isError: isErrorPublicCodes,
    data: dataPublicCodes,
  } = useGetIsPrivateCodeFromUser(false, idCurrent)

  const {
    isLoading: isLoadingFavoriteCodes,
    isError: isErrorFavoriteCodes,
    data: dataFavoriteCodes,
  } = useGetFavoriteCode(idCurrent)

  const { updateUserDocument }: any = useUpdateUserDocument("users")

  const addUserOnFollowers = async (pseudo: string, id: string) => {
    let updatedUserData = {
      followers: data.data.followers.includes(id)
        ? data.data.followers.filter((item) => item !== id)
        : [...data.data.followers, id],
    }

    updateUserDocument({ pseudo, updatedUserData })
  }

  const addUserOnFollowing = async (id: string, pseudo: string) => {
    let updatedUserData = {
      following: dataUser?.data?.following.includes(id)
        ? dataUser?.data?.following.filter((item) => item !== id)
        : [...dataUser?.data?.following, id],
    }

    updateUserDocument({ pseudo, updatedUserData })
  }
  
  return (
    <Layout>
      <Head>
        <title>Sharuco</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
           useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sharuco" />
        <meta name="twitter:description" content="View this user on Sharuco" />
        <meta
          name="twitter:image"
          content="https://sharuco.lndev.me/sharuco-user.png"
        />

        <meta property="og:title" content="Sharuco" />
        <meta property="og:description" content="View this user on Sharuco" />
        <meta
          property="og:image"
          content="https://sharuco.lndev.me/sharuco-user.png"
        />
        <meta property="og:url" content="https://sharuco.lndev.me/ln-dev7" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        {isLoading && <LoaderCodes isUserProfile={true} />}
        {data && data.exists && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
              <Avatar className="h-40 w-40 cursor-pointer">
                <AvatarImage
                  src={data.data.photoURL}
                  alt={
                    data.data.displayName !== null
                      ? data.data.displayName
                      : idCurrent
                  }
                />
                <AvatarFallback>
                  {data.data.displayName !== null
                    ? data.data.displayName
                    : idCurrent}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mb-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-0">
                <h1 className="text-center text-4xl font-bold">
                  {data.data.displayName !== null ? (
                    <>
                      {data.data.displayName.split(" ")[0]}{" "}
                      {data.data.displayName.split(" ")[1] &&
                        data.data.displayName.split(" ")[1]}
                    </>
                  ) : (
                    idCurrent
                  )}
                </h1>
                <span className="ml-2">
                  {data.data.premium && (
                    <Verified className="h-6 w-6 text-green-500" />
                  )}
                </span>
              </div>
              {user ? (
                <>
                  {user && idCurrent !== dataUser?.data?.pseudo ? (
                    dataUser?.data?.following.includes(idCurrent) ? (
                      <Button
                        onClick={() => {
                          addUserOnFollowers(idCurrent, dataUser?.data?.pseudo)
                          addUserOnFollowing(idCurrent, dataUser?.data?.pseudo)
                        }}
                        className="my-2 rounded-full"
                      >
                        Unfollow
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          addUserOnFollowers(idCurrent, dataUser?.data?.pseudo)
                          addUserOnFollowing(idCurrent, dataUser?.data?.pseudo)
                        }}
                        className="my-2 rounded-full"
                      >
                        Follow
                      </Button>
                    )
                  ) : null}
                </>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="top-0 right-0 rounded-full">
                      Follow
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Do you want to follow{" "}
                        <a
                          href={`/user/${idCurrent}`}
                          className="font-semibold text-slate-900 hover:underline hover:underline-offset-4 dark:text-slate-100"
                        >
                          {idCurrent}
                        </a>{" "}
                        ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Join Sharuco now !
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <button
                        className={cn(
                          "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                        )}
                        disabled={isPending}
                        onClick={login}
                      >
                        {isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Github className="mr-2 h-4 w-4" />
                        )}
                        Login with Github
                      </button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-md font-semibold text-slate-900 dark:text-slate-100">
                  <Dialog>
                    <DialogTrigger asChild>
                      <span className="cursor-pointer hover:underline hover:underline-offset-2">
                        {data.data.followers.length} followers
                      </span>
                    </DialogTrigger>
                    <DialogContent className="max-h-[640px] overflow-hidden overflow-y-auto scrollbar-hide">
                      <DialogHeader>
                        <DialogTitle>Followers</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-wrap gap-2">
                        {data.data.followers.map((follower) => (
                          <a
                            href={`/user/${follower}`}
                            key={follower}
                            className="w-full bg-slate-100 border-2 border-transparent dark:bg-slate-700 px-4 py-2 rounded-lg flex items-center justify-start gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:border-2 hover:border-sky-400"
                          >
                            <UserIcon className="h-4 w-4" />
                            <span className="hover:underline">{follower}</span>
                          </a>
                        ))}
                        {data.data.followers.length === 0 && (
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            This user has no followers yet.
                          </p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <span>•</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <span className="cursor-pointer hover:underline hover:underline-offset-2">
                        {data.data.following.length} following
                      </span>
                    </DialogTrigger>
                    <DialogContent className="max-h-[640px] overflow-hidden overflow-y-auto scrollbar-hide">
                      <DialogHeader>
                        <DialogTitle>Following</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-wrap gap-2">
                        {data.data.following.map((following) => (
                          <a
                            href={`/user/${following}`}
                            key={following}
                            className="w-full bg-slate-100 border-2 border-transparent dark:bg-slate-700 px-4 py-2 rounded-lg flex items-center justify-start gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:border-2 hover:border-sky-400"
                          >
                            <UserIcon className="h-4 w-4" />
                            <span className="hover:underline">{following}</span>
                          </a>
                        ))}
                        {data.data.following.length === 0 && (
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            This user has no following yet.
                          </p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-center text-gray-500">
                  Joined{" "}
                  <span className="font-bold">
                    {moment(data.data.createdAt).fromNow()}
                  </span>
                </p>
              </div>
            </div>
            <Tabs defaultValue="public-code" className="w-full">
              <TabsList>
                <div>
                  <TabsTrigger value="public-code">
                    <Eye className="mr-2 h-4 w-4" />
                    public code
                  </TabsTrigger>
                  <TabsTrigger value="favorite-code">
                    <Star className="mr-2 h-4 w-4" />
                    Favorite code
                  </TabsTrigger>
                </div>
              </TabsList>
              <TabsContent className="border-none p-0 pt-4" value="public-code">
                {isLoadingPublicCodes && <LoaderCodes />}
                {dataPublicCodes && (
                  <>
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        659: 1,
                        660: 1,
                        720: 1,
                        1200: 2,
                      }}
                      className="w-full"
                    >
                      <Masonry gutter="2rem">
                        {dataPublicCodes.map(
                          (code: {
                            id: string
                            idAuthor: string
                            language: string
                            code: string
                            description: string
                            tags: string[]
                            favoris: string[]
                            isPrivate: boolean
                            currentUser: any
                            comments: any
                          }) => (
                            <CardCode
                              key={code.id}
                              id={code.id}
                              idAuthor={code.idAuthor}
                              language={code.language}
                              code={code.code}
                              description={code.description}
                              tags={code.tags}
                              favoris={code.favoris}
                              isPrivate={code.isPrivate}
                              currentUser={data?.data}
                              comments={code.comments}
                            />
                          )
                        )}
                      </Masonry>
                    </ResponsiveMasonry>
                    {dataPublicCodes.length == 0 && (
                      <div className="flex flex-col items-center gap-4">
                        <h1 className="text-center text-2xl font-bold">
                          This user has not shared any code yet
                        </h1>
                      </div>
                    )}
                  </>
                )}
                {isErrorPublicCodes && <Error />}
              </TabsContent>
              <TabsContent
                className="border-none p-0 pt-4"
                value="favorite-code"
              >
                {isLoadingFavoriteCodes && <LoaderCodes />}
                {dataFavoriteCodes && (
                  <>
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        659: 1,
                        660: 1,
                        720: 1,
                        1200: 2,
                      }}
                      className="w-full"
                    >
                      <Masonry gutter="2rem">
                        {dataFavoriteCodes.map(
                          (code: {
                            id: string
                            idAuthor: string
                            language: string
                            code: string
                            description: string
                            tags: string[]
                            favoris: string[]
                            isPrivate: boolean
                            currentUser: any
                            comments: any
                          }) => (
                            <CardCode
                              key={code.id}
                              id={code.id}
                              idAuthor={code.idAuthor}
                              language={code.language}
                              code={code.code}
                              description={code.description}
                              tags={code.tags}
                              favoris={code.favoris}
                              isPrivate={code.isPrivate}
                              currentUser={data?.data}
                              comments={code.comments}
                            />
                          )
                        )}
                      </Masonry>
                    </ResponsiveMasonry>
                    {dataFavoriteCodes.length == 0 && (
                      <div className="flex flex-col items-center gap-4">
                        <h1 className="text-center text-2xl font-bold">
                          This user has not favorite any code yet
                        </h1>
                      </div>
                    )}
                  </>
                )}
                {isErrorFavoriteCodes && <Error />}
              </TabsContent>
            </Tabs>
          </div>
        )}
        {data && !data.exists && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">User not found</h1>
            <Link
              href="/"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Go back to home
            </Link>
          </div>
        )}
        {isError && <Error />}
      </section>
    </Layout>
  )
}
