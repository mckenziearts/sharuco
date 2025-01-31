import React, { useEffect } from "react"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useAuthContext } from "@/context/AuthContext"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useUpdateUserDocument } from "@/firebase/firestore/updateUserDocument.js"
import { yupResolver } from "@hookform/resolvers/yup"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import * as yup from "yup"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function AddPersonalAccessToken() {
  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName
  const router = useRouter()
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  })

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(pseudo, "users")

  const schema = yup.object().shape({
    personalAccessToken: yup.string().required(),
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const { updateUserDocument, isLoading, isError, isSuccess }: any =
    useUpdateUserDocument("users")

  const onSubmit = async (data) => {
    const { personalAccessToken } = data
    let updatedUserData: {
      personalAccessToken: string
    } = {
      personalAccessToken: personalAccessToken,
    }

    updateUserDocument({ pseudo, updatedUserData })
    reset({
      personalAccessToken: "",
    })
    toast.custom((t) => (
      <div
        className="mt-4 rounded-lg border-2 border-green-600 bg-green-50 p-4 text-sm text-green-600 dark:bg-gray-800 dark:text-green-300"
        role="alert"
      >
        Your personal access token has been added / updated
      </div>
    ))
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
        <meta
          name="twitter:description"
          content="Share your code with everyone"
        />
        <meta
          name="twitter:image"
          content="https://sharuco.lndev.me/sharuco-banner.png"
        />

        <meta property="og:title" content="Sharuco" />
        <meta
          property="og:description"
          content="Share your code with everyone"
        />
        <meta
          property="og:image"
          content="https://sharuco.lndev.me/sharuco-banner.png"
        />
        <meta property="og:url" content="https://sharuco.lndev.me" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-8 pt-6 pb-8 md:py-10">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            Guides to add your personal access token on Sharuco
          </h1>
          {dataUser?.data.personalAccessToken ? (
            <div className="mt-2 inline-flex items-center rounded-lg border border-green-200 bg-green-100 px-2.5 py-2 text-sm font-medium text-green-800 dark:bg-gray-800 dark:text-green-300 dark:border-none">
              You already have a token, but you can always create a new one and
              update it here
            </div>
          ) : null}
          <Separator className="my-4" />
          <div className="w-full">
            <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
              1- Follow this link{" "}
              <a
                href="https://github.com/settings/tokens/new"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline underline-offset-4"
              >
                https://github.com/settings/tokens/new{" "}
              </a>{" "}
              to create a new personal access token on your GitHub account.
            </p>
          </div>
          <Separator className="my-4" />
          <div className="w-full">
            <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
              2- Add a note about the use of your token, you can put{" "}
              <span className="font-medium">
                « Give Sharuco access to create my Gist »
              </span>{" "}
            </p>
            <p className="mt-4 text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
              3- Choose an expiry date for your token{" "}
            </p>
            <div
              className="p-4 mt-2 w-full lg:w-3/4 text-sm leading-6 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 font-medium"
              role="alert"
            >
              Once the expiration date has passed, your token will no longer be
              valid and you will not be able to add a code to Github Gist from
              Sharuco. <br />
              You will have to create a new token on github and update it on
              this page. <br /> If you know that you will forget this, we advise
              you not to put an expiration on your token.
            </div>
            <Image
              src="/guides/add-personal-access-token-1.png"
              alt="GitHub personal access token"
              width={995}
              height={365}
              className="mt-4 rounded-lg w-full lg:w-3/4 h-auto"
            />
          </div>
          <Separator className="my-4" />
          <div className="w-full">
            <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
              4- Scroll down and select the{" "}
              <span className="font-medium">« gist »</span> box, then scroll
              down again and click on{" "}
              <span className="font-medium">« Generate token »</span>.
            </p>
            <Image
              src="/guides/add-personal-access-token-2.png"
              alt="GitHub personal access token"
              width={975}
              height={157}
              className="mt-4 rounded-lg w-full lg:w-3/4 h-auto"
            />
          </div>
          <Separator className="my-4" />
          <div className="w-full">
            <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
              6- Copy your token ( after it will not be visible anymore, make
              sure you have copied it )
            </p>
            <Image
              src="/guides/add-personal-access-token-3.png"
              alt="GitHub personal access token"
              width={984}
              height={142}
              className="mt-4 rounded-lg w-full lg:w-3/4 h-auto"
            />
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col sm:flex-row items-center w-full items-center gap-2">
            <Input
              type="text"
              placeholder="Paste your token here"
              id="personalAccessToken"
              {...register("personalAccessToken")}
            />
            <Button
              className="shrink-0 w-full sm:w-fit"
              disabled={isLoading}
              onClick={!isLoading ? handleSubmit(onSubmit) : undefined}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dataUser?.data.personalAccessToken ? (
                <>Update your token</>
              ) : (
                <>Add your token</>
              )}
            </Button>
          </div>
          <p className="text-sm text-red-500">
            {errors.personalAccessToken && <>You must enter a token</>}
          </p>
          <div
            className="p-4 mt-2 w-fit text-sm leading-6 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 font-medium"
            role="alert"
          >
            If you insert the wrong token, you will not be able to add to your
            Github Gist.
          </div>
        </div>
      </section>
    </Layout>
  )
}
