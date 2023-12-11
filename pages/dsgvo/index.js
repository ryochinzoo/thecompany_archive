import FooterParts from "../../components/templates/footerParts"
import Image from "next/image"
import utilStyles from "../../styles/dsvgo.module.css"
import Link from "next/link"
import { strapiHandler } from "../api/strapiHandler"

export async function getStaticProps({ locale }) {
    const [staticPage] = await Promise.all([
        strapiHandler("/static-pages")
    ])
    return {
      props: {
        staticPage
      },
      revalidate: 10,
    }
  }
export default function DSGVO({staticPage}) {
    const key = "DSGVO"
    const contents = getContents(key, staticPage.data)
    function getContents(key, data) {
        const result = data.find(el => { 
            return el.attributes.PageType === key
        })
        return result.attributes
    }
    return(
        <>
            <div className="other-page">
                <div className={utilStyles.headerLogo}>
                    <Link href="/" passHref={true}>
                        <a style={{textDecoration: "none"}}>
                            <Image
                                src={"/images/newlogo.png"}
                                alt="logo"
                                width={239}
                                height={64}
                                objectFit="contain"
                                loading='lazy'
                            />
                        </a>
                    </Link>
                </div>
                <div className="other-page-section-header text-center">
                    <h1>PRIVACY</h1>
                </div>

                <div className="rte">
                    <div dangerouslySetInnerHTML={{__html: contents.Contents}}></div>
                </div>
            </div>
            <div className={`footer`}>
            <FooterParts
              mailInfo={"MailingList"}
              isMain={false}
            ></FooterParts>
          </div>
        </>
    )
}