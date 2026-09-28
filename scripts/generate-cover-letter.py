from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageTemplate,
    Paragraph,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "Spencer_McKnight_Cover_Letter.pdf"
FONT_DIR = ROOT / "public" / "fonts" / "reforma"
REFORMA = FONT_DIR / "reforma.1969-gris.ttf"

PAGE_WIDTH, PAGE_HEIGHT = A4
PAPER = colors.HexColor("#FFEDD7")
STONE = colors.HexColor("#403D39")
IRON = colors.HexColor("#1B1B1A")
EMBER = colors.HexColor("#DD6637")
MUTED = colors.HexColor("#6A625A")


if REFORMA.exists():
    pdfmetrics.registerFont(TTFont("Reforma", str(REFORMA)))
    heading_font = "Reforma"
else:
    heading_font = "Helvetica-Bold"


class CoverLetterTemplate(BaseDocTemplate):
    def __init__(self, filename: str):
        super().__init__(
            filename,
            pagesize=A4,
            leftMargin=25 * mm,
            rightMargin=25 * mm,
            topMargin=48 * mm,
            bottomMargin=20 * mm,
            title="Cover Letter | Spencer McKnight",
            author="Spencer McKnight",
            subject="Full-Stack and Software Engineering Opportunities",
        )
        frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            id="letter",
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
        )
        self.addPageTemplates(PageTemplate(id="cover", frames=[frame], onPage=self.draw_page))

    def draw_page(self, canvas, _doc):
        canvas.saveState()
        canvas.setFillColor(PAPER)
        canvas.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)

        canvas.setFillColor(STONE)
        canvas.rect(0, PAGE_HEIGHT - 40 * mm, PAGE_WIDTH, 40 * mm, fill=1, stroke=0)
        canvas.setFillColor(EMBER)
        canvas.rect(0, PAGE_HEIGHT - 40.6 * mm, PAGE_WIDTH, 0.6 * mm, fill=1, stroke=0)

        canvas.setFillColor(PAPER)
        canvas.setFont(heading_font, 24)
        canvas.drawString(25 * mm, PAGE_HEIGHT - 18 * mm, "Spencer McKnight")

        wordmark_text = "DIGITAL KNIGHT"
        wordmark_size = 7.2
        wordmark_tracking = 1.4
        wordmark_width = pdfmetrics.stringWidth(
            wordmark_text, "Helvetica-Bold", wordmark_size
        ) + wordmark_tracking * (len(wordmark_text) - 1)
        wordmark = canvas.beginText()
        wordmark.setTextOrigin(185 * mm - wordmark_width, PAGE_HEIGHT - 16 * mm)
        wordmark.setFont("Helvetica-Bold", 7.2)
        wordmark.setCharSpace(wordmark_tracking)
        wordmark.setFillColor(PAPER)
        wordmark.setTextRenderMode(0)
        wordmark.textOut(wordmark_text)
        canvas.drawText(wordmark)

        canvas.setFont("Helvetica", 8.7)
        canvas.setFillColor(PAPER)
        canvas.drawString(
            25 * mm,
            PAGE_HEIGHT - 27 * mm,
            "FULL-STACK DEVELOPER  |  TECHNICAL STRATEGY  |  AI-ASSISTED ENGINEERING",
        )

        canvas.setFont("Helvetica", 8.4)
        contact_y = PAGE_HEIGHT - 34 * mm
        canvas.drawString(25 * mm, contact_y, "Erlangen, Germany")
        canvas.drawString(65 * mm, contact_y, "hello@digital-knight.au")
        canvas.drawString(120 * mm, contact_y, "digital-knight.au")
        canvas.drawRightString(185 * mm, contact_y, "linkedin.com/in/spencer-mcknight")

        canvas.setStrokeColor(colors.Color(27 / 255, 27 / 255, 26 / 255, alpha=0.16))
        canvas.setLineWidth(0.5)
        canvas.line(25 * mm, 16 * mm, 185 * mm, 16 * mm)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 7.5)
        canvas.drawString(25 * mm, 11.5 * mm, "SPENCER MCKNIGHT")
        canvas.drawRightString(185 * mm, 11.5 * mm, "COVER LETTER")
        canvas.restoreState()


styles = getSampleStyleSheet()
date_style = ParagraphStyle(
    "Date",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=9,
    leading=12,
    textColor=MUTED,
    alignment=TA_LEFT,
    spaceAfter=8,
)
subject_style = ParagraphStyle(
    "Subject",
    parent=styles["Heading2"],
    fontName=heading_font,
    fontSize=16,
    leading=19,
    textColor=IRON,
    spaceAfter=12,
)
body_style = ParagraphStyle(
    "Body",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=10.2,
    leading=15.4,
    textColor=IRON,
    spaceAfter=12,
)
salutation_style = ParagraphStyle(
    "Salutation",
    parent=body_style,
    spaceAfter=10,
)
signoff_style = ParagraphStyle(
    "Signoff",
    parent=body_style,
    spaceBefore=4,
    spaceAfter=0,
)
name_style = ParagraphStyle(
    "Name",
    parent=body_style,
    fontName="Helvetica-Bold",
    textColor=IRON,
    spaceAfter=0,
)


story = [
    Paragraph("16 July 2026", date_style),
    Paragraph("Re: Full-Stack and Software Engineering Opportunities", subject_style),
    Paragraph("Dear Hiring Team,", salutation_style),
    Paragraph(
        "I am a strategic full-stack developer based in Erlangen, looking to solve technically "
        "demanding problems within Germany's technology sector. I offer a combination of "
        "hands-on engineering, product judgement and end-to-end ownership. Rather than treating "
        "development as ticket completion, I work to understand why a system matters, define "
        "what success means and shape a reliable solution around its users and business.",
        body_style,
    ),
    Paragraph(
        "My strongest work sits where polished user experiences meet system complexity. I "
        "specialise in React, Next.js and TypeScript, with broader experience across mobile, "
        "cloud infrastructure, secure API layers and SAP-connected enterprise applications. I "
        "can move from an ambiguous problem through architecture and prototyping into production, "
        "while communicating clearly with designers, stakeholders and engineers. Performance, "
        "accessibility, testing and maintainability remain part of the solution from the start.",
        body_style,
    ),
    Paragraph(
        "This approach has produced measurable results. Through Digital Knight, I delivered a "
        "strategic rebuild that increased engagement by 90%, and created an enterprise prototype "
        "in four working days before developing it into a tested SAP-integrated application. At "
        "Inlight, I contributed to an award-winning mobile experience, supported a year of "
        "zero-rollback releases and received the Rising Star Award for accelerated growth and "
        "performance.",
        body_style,
    ),
    Paragraph(
        "I learn quickly, take responsibility readily and use AI-assisted engineering "
        "pragmatically to accelerate delivery without surrendering judgement or quality. I have "
        "a general understanding of German and am actively developing my spoken and written "
        "proficiency, while working confidently in English. I would bring technical depth, "
        "curiosity and dependable execution to a team that values thoughtful solutions to "
        "difficult problems.",
        body_style,
    ),
    Paragraph(
        "Thank you for considering my application. I would welcome the opportunity to discuss "
        "the challenges your team is working to solve.",
        body_style,
    ),
    Spacer(1, 3 * mm),
    Paragraph("Kind regards,", signoff_style),
    Spacer(1, 2 * mm),
    Paragraph("Spencer McKnight", name_style),
]


document = CoverLetterTemplate(str(OUTPUT))
document.build(story)
print(OUTPUT)
