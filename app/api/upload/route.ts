import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function POST(req: Request) {
  try {
      const formData = await req.formData();
          const file = formData.get("file") as File;

              if (!file) {
                    return NextResponse.json(
                            { success: false, error: "No file object detected in the upload payload." },
                                    { status: 400 }
                                          );
                                              }

                                                  // Safety check to verify environment keys are being read by the server runtime
                                                      if (!process.env.R2_BUCKET_NAME || !process.env.R2_PUBLIC_URL) {
                                                            return NextResponse.json(
                                                                    { 
                                                                              success: false, 
                                                                                        error: `Server Configuration Mismatch: BUCKET_NAME is ${process.env.R2_BUCKET_NAME ? 'Defined' : 'Missing'}, PUBLIC_URL is ${process.env.R2_PUBLIC_URL ? 'Defined' : 'Missing'}` 
                                                                                                },
                                                                                                        { status: 500 }
                                                                                                              );
                                                                                                                  }

                                                                                                                      // Convert file to a standard portable modern byte array (Avoids Node-specific Buffer crashes)
                                                                                                                          const arrayBuffer = await file.arrayBuffer();
                                                                                                                              const uint8Array = new Uint8Array(arrayBuffer);

                                                                                                                                  // Sanitize file name to prevent string interpolation issues in headers
                                                                                                                                      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
                                                                                                                                          const fileName = `${Date.now()}-${sanitizedName}`;

                                                                                                                                              // Execute upload to Cloudflare storage cluster
                                                                                                                                                  await r2.send(
                                                                                                                                                        new PutObjectCommand({
                                                                                                                                                                Bucket: process.env.R2_BUCKET_NAME,
                                                                                                                                                                        Key: fileName,
                                                                                                                                                                                Body: uint8Array, // Passing standard unified stream payload
                                                                                                                                                                                        ContentType: file.type,
                                                                                                                                                                                              })
                                                                                                                                                                                                  );

                                                                                                                                                                                                      const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

                                                                                                                                                                                                          return NextResponse.json({
                                                                                                                                                                                                                success: true,
                                                                                                                                                                                                                      url: imageUrl,
                                                                                                                                                                                                                          });

                                                                                                                                                                                                                            } catch (error: any) {
                                                                                                                                                                                                                                console.error("CRITICAL API ROUTE EXCEPTION:", error);

                                                                                                                                                                                                                                    // This converts internal crashes to JSON, ensuring the frontend never encounters '<html>' again
                                                                                                                                                                                                                                        return NextResponse.json(
                                                                                                                                                                                                                                              { 
                                                                                                                                                                                                                                                      success: false, 
                                                                                                                                                                                                                                                              error: `Server Exception: ${error.message || "An unhandled storage pipeline crash occurred."}` 
                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                          { status: 500 }
                                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                